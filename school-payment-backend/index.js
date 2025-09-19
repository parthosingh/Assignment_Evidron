const express = require("express");
const { connectDB } = require("./config/db");

const {userRouter} = require('./routes/auth.routes');
const {paymentRouter} = require('./routes/payment.routes');
const {webhookRouter} = require('./routes/webhook.routes');

const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: "*",          
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,                       
  })
);

app.use(express.json());

app.use('/api/auth', userRouter);
app.use('/api/payments', paymentRouter);
app.use('/api/webhook', webhookRouter); 

app.listen(8080, () => {
  connectDB();
  console.log("Server is running at http://localhost:8080");
});