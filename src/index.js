import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'

import authRoutes from './routes/auth.routes.js';
import sellerRoutes from './routes/seller.routes.js'
import commonRoutes from './routes/common.routes.js'


dotenv.config();

const mongoURI = process.env.mongodb;

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Successfully connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

const app = express();

app.use(express.json());
app.use(cors({credentials:true, origin: process.env.ALLOWED_ORIGIN}));
app.use(cookieParser());
// 'https://rentify-frontend-7xmf.onrender.com'

app.get('/health', async (req, res) => {
     res.json({message: "health OK!"})
});


app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/common', commonRoutes)

app.listen(3000, () => {
    console.log("Server started successfully!")
})
