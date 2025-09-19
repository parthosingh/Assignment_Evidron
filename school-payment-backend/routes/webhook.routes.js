const express = require('express');
const mongoose = require('mongoose'); 
const {OrderStatusModel} = require('../models/orderstatus.model');
const {WebhookLogModel} = require('../models/webhooklog.model');

const webhookRouter = express.Router();

webhookRouter.post('/', async (req, res) => {
  const payload = req.body;

 
  const log = new WebhookLogModel({
    payload,
    status: payload.status || 200,
    processed: false,
  });
  await log.save();

  try {
    // Validate payload
    if (!payload.order_info || !payload.order_info.order_id) {
      log.error = 'Missing order_info or order_id';
      await log.save();
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const orderInfo = payload.order_info;
    const collect_id = orderInfo.order_id; 
    
    const updateData = {
      collect_id: new mongoose.Types.ObjectId(collect_id), // Changed to new keyword
      order_amount: orderInfo.order_amount || 0,
      transaction_amount: orderInfo.transaction_amount || 0,
      payment_mode: orderInfo.payment_mode || 'unknown',
      payment_details: orderInfo.payment_details || 'N/A',
      bank_reference: orderInfo.bank_reference || 'N/A',
      payment_message: orderInfo.payment_message || 'N/A',
      status: orderInfo.status || 'pending',
      error_message: orderInfo.error_message || 'N/A',
      payment_time: orderInfo.payment_time ? new Date(orderInfo.payment_time) : new Date(),
    };

    // Validate date
    if (isNaN(updateData.payment_time.getTime())) {
      throw new Error('Invalid payment_time format');
    }

    // Update or create OrderStatus entry with validation
    await OrderStatusModel.findOneAndUpdate(
      { collect_id: updateData.collect_id },
      updateData,
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
    );

    // Mark log as processed on success
    log.processed = true;
    log.error = null;
    await log.save();

    res.status(200).json({ message: 'Webhook processed' });
  } catch (err) {
    log.error = err.message;
    await log.save();
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = {webhookRouter};