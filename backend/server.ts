import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize env vars before importing other modules
dotenv.config();

// Imports must include .js extension since we are using ES Modules
import protectRouter from './routes/protect.js';
import verifyRouter from './routes/verify.js';
// Import db just to initialize it on startup
import './config/firebase.js'; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Trust proxy required for rate limiter to work correctly behind Cloud Run load balancer
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/protect', protectRouter);
app.use('/api/verify', verifyRouter);

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`U_Design Secure Backend running on http://localhost:${port}`);
});
