const express = require('express');
const { OrderModel } = require('../models/order.model');
const { OrderStatusModel } = require('../models/orderstatus.model');
const { authMiddleware } = require('../middleware/auth.middleware');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const paymentRouter = express.Router();

paymentRouter.use(authMiddleware);

paymentRouter.post('/create-payment', async (req, res) => {
  const { school_id, trustee_id, student_info, gateway_name, order_amount, custom_order_id, payment_time, status, transaction_amount, payment_mode, payment_details, payment_message, bank_reference } = req.body;

  if (!school_id || !trustee_id || !student_info || !gateway_name || !order_amount) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (typeof student_info !== 'object' || !student_info.name || !student_info.id || !student_info.email) {
    return res.status(400).json({ message: 'student_info must be an object with name, id, and email' });
  }

  try {
    const order = new OrderModel({
      school_id: school_id || process.env.SCHOOL_ID,
      trustee_id,
      student_info,
      gateway_name,
      custom_order_id: custom_order_id || `ORD-${Date.now()}`
    });
    console.log('Saving order:', order.toObject());
    await order.save();
    console.log('Order saved successfully:', order._id);

    const payload = {
      order_id: order._id.toString(),
      amount: order_amount.toString(),
      school_id: school_id || process.env.SCHOOL_ID,
    };
    const callback_url = process.env.GATEWAY_CALLBACK_URL || 'https://1234-5678.ngrok.io/callback';
    console.warn('Using callback_url:', callback_url, 'Ensure this is a valid public URL.');
    const signPayload = {
      school_id: payload.school_id,
      amount: payload.amount,
      callback_url: callback_url
    };

    if (!process.env.API_KEY || !process.env.API_KEY.trim()) {
      console.error('API_KEY is not set or empty in .env');
      return res.status(500).json({ message: 'Server configuration error: API_KEY missing or empty' });
    }
    if (!process.env.PG_KEY || !process.env.PG_KEY.trim()) {
      console.error('PG_KEY is not set or empty in .env');
      return res.status(500).json({ message: 'Server configuration error: PG_KEY missing or empty' });
    }

    const sign = jwt.sign(signPayload, process.env.PG_KEY, { expiresIn: '5m' });
    console.log('Generated sign:', sign);

    console.log('Gateway Request Payload:', {
      school_id: payload.school_id,
      amount: payload.amount,
      callback_url: callback_url,
      sign: sign
    });

    const gatewayResponse = await fetch('https://dev-vanilla.edviron.com/erp/create-collect-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`
      },
      body: JSON.stringify({
        school_id: payload.school_id,
        amount: payload.amount,
        callback_url: callback_url,
        sign: sign
      }),
      timeout: 15000
    });

    const responseText = await gatewayResponse.text();
    console.log('Gateway Status:', gatewayResponse.status);
    console.log('Gateway Headers:', Object.fromEntries(gatewayResponse.headers.entries()));
    console.log('Gateway Response Body:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse gateway response:', responseText);
      return res.status(500).json({ message: 'Invalid gateway response format', rawResponse: responseText });
    }

    if (!gatewayResponse.ok) {
      console.error('Gateway Error Details:', data.error || 'No error details', 'Status:', gatewayResponse.status);
      const orderStatus = new OrderStatusModel({
        collect_id: order._id,
        order_amount,
        transaction_amount: transaction_amount || 0,
        payment_mode: payment_mode || 'initial',
        status: 'failed', // Dynamic: set to 'failed' on gateway error
        payment_details: payment_details || 'N/A',
        payment_message: payment_message || 'N/A',
        bank_reference: bank_reference || 'N/A',
        payment_time: payment_time ? new Date(payment_time) : new Date()
      });
      await orderStatus.save();
      return res.status(gatewayResponse.status).json({ message: data.error || 'Payment initiation failed', details: data });
    }

    if (!data.collect_request_url) {
      return res.status(500).json({ message: 'Invalid gateway response: collect_request_url missing', response: data });
    }

    const orderStatus = new OrderStatusModel({
      collect_id: order._id,
      order_amount,
      transaction_amount: transaction_amount || 0,
      payment_mode: payment_mode || 'initial',
      status: status || 'pending', // Dynamic: use request status or default to 'pending' on success
      payment_details: payment_details || 'N/A',
      payment_message: payment_message || 'N/A',
      bank_reference: bank_reference || 'N/A',
      payment_time: payment_time ? new Date(payment_time) : new Date()
    });
    console.log('Saving order status:', orderStatus.toObject());
    await orderStatus.save();
    console.log('Order status saved successfully:', orderStatus._id);

    res.json({ payment_url: data.collect_request_url });
  } catch (err) {
    console.error('Create payment error:', err.message, 'Stack:', err.stack);
    res.status(500).json({ message: 'Server error', error: err.message, stack: err.stack });
  }
});

paymentRouter.get('/transactions', async (req, res) => {
  const { page = 1, limit = 10, sort = 'payment_time', order = 'desc', status, custom_order_id, school_id } = req.query;
  console.log('Raw Query params:', req.query);
  console.log('Parsed Query params:', { page, limit, sort, order, status, custom_order_id, school_id });

  try {
    const statusArray = status ? (Array.isArray(status) ? status : status.split(',')) : [];
    const matchStage = {
      ...(statusArray.length > 0 && { 'status_info.status': { $in: statusArray } }),
      ...(custom_order_id && { custom_order_id: custom_order_id }),
      ...(school_id && { school_id: { $in: Array.isArray(school_id) ? school_id : school_id.split(',') } })
    };
    console.log('Match stage:', matchStage);

    const countAggregation = [
      { $lookup: { from: 'orderstatuses', localField: '_id', foreignField: 'collect_id', as: 'status_info' } },
      { $unwind: { path: '$status_info', preserveNullAndEmptyArrays: true } },
      { $match: matchStage },
      { $count: 'total' }
    ];
    const countResult = await OrderModel.aggregate(countAggregation).exec();
    const totalItems = countResult.length > 0 ? countResult[0].total : 0;
    const totalPages = Math.ceil(totalItems / limit);

    const aggregation = [
      { $lookup: { from: 'orderstatuses', localField: '_id', foreignField: 'collect_id', as: 'status_info' } },
      { $unwind: { path: '$status_info', preserveNullAndEmptyArrays: true } },
      { $match: matchStage },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: { $ifNull: ['$status_info.order_amount', 0] },
          transaction_amount: { $ifNull: ['$status_info.transaction_amount', 0] },
          status: { $ifNull: ['$status_info.status', 'pending'] },
          custom_order_id: 1,
          student_info: 1,
          payment_time: '$status_info.payment_time'
        }
      },
      { $sort: { [sort]: order === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ];

    const aggregationCursor = OrderModel.aggregate(aggregation);
    const transactions = await aggregationCursor.exec();
    const transformedTransactions = transactions.map(t => ({
      ...t,
      studentName: t.student_info?.name || 'N/A',
      Phone: t.student_info?.id || 'N/A'
    }));
    console.log('Transactions result:', transformedTransactions);
    res.json({
      data: transformedTransactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: totalPages,
        totalItems: totalItems,
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Transactions aggregation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

paymentRouter.get('/transactions/school/:schoolId', async (req, res) => {
  const { schoolId } = req.params;
  const { page = 1, limit = 10, sort = 'payment_time', order = 'desc' } = req.query;
  console.log('Received schoolId:', schoolId);
  console.log('Query params:', { page, limit, sort, order });

  try {
    const aggregation = [
      { $match: { school_id: schoolId } },
      {
        $lookup: {
          from: 'orderstatuses',
          localField: '_id',
          foreignField: 'collect_id',
          as: 'status_info'
        }
      },
      { $unwind: { path: '$status_info', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          collect_id: '$_id',
          school_id: 1,
          gateway: '$gateway_name',
          order_amount: { $ifNull: ['$status_info.order_amount', 0] },
          transaction_amount: { $ifNull: ['$status_info.transaction_amount', 0] },
          status: { $ifNull: ['$status_info.status', 'pending'] },
          custom_order_id: 1,
          student_info: 1,
          payment_time: '$status_info.payment_time'
        }
      },
      { $sort: { [sort]: order === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ];

    const aggregationCursor = OrderModel.aggregate(aggregation);
    const transactions = await aggregationCursor.exec();
    const transformedTransactions = transactions.map(t => ({
      ...t,
      studentName: t.student_info?.name || 'N/A',
      Phone: t.student_info?.id || 'N/A'
    }));
    console.log('Transactions by school result:', transformedTransactions);
    if (transformedTransactions.length === 0) {
      console.log(`No transactions found for schoolId: ${schoolId}`);
    }
    res.json(transformedTransactions);
  } catch (err) {
    console.error('Transactions by school aggregation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

paymentRouter.get('/transaction-status/:custom_order_id', async (req, res) => {
  const { custom_order_id } = req.params;

  try {
    const order = await OrderModel.findOne({ custom_order_id });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const status = await OrderStatusModel.findOne({ collect_id: order._id });
    res.json({ status: status ? status.status : 'pending' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = { paymentRouter };