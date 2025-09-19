
const mongoose = require('mongoose');

 const webhookLogSchema = new mongoose.Schema({
  payload: { type: Object, required: true }, 
  status: { type: Number, required: true },
  received_at: { type: Date, default: Date.now, required: true }, 
  processed: { type: Boolean, default: false, required: true }, 
  error: { type: String } 
}, { timestamps: true }); 
const WebhookLogModel =  mongoose.model('WebhookLog', webhookLogSchema);

module.exports = {WebhookLogModel};