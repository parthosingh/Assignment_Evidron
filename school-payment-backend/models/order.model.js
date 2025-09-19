const mongoose = require("mongoose");

const studentInfoSchema = new mongoose.Schema({
    name: {type: String, required: true},
    id: {type: String, required: true},
    email: {type: String, required: true}
});

const orderSchema = new mongoose.Schema({
    school_id: {type: String, required: true, index: true},
    trustee_id: {type: String, required: true},
    student_info: {type: studentInfoSchema, required: true}, 
    gateway_name: {type: String, required: true},
    custom_order_id: {type: String, required: true, unique: true}
}, { timestamps: true });

const OrderModel = mongoose.model("Order", orderSchema); 

module.exports = {OrderModel};