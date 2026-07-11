import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize env vars before importing other modules
dotenv.config();

// Imports must include .js extension since we are using ES Modules
import protectRouter from './routes/protect';
import verifyRouter from './routes/verify';
// Import db just to initialize it on startup
import './config/firebase'; 



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

// Serve static frontend files in production (only if not on Vercel)
if (!process.env.VERCEL) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  
  app.use(express.static(path.join(__dirname, '../dist')));
  // Fallback to index.html for React Router
  app.get('*', (req, res) => {
    // Only intercept non-api requests
    if (!req.path.startsWith('/api/')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    }
  });

  app.listen(port, () => {
    console.log(`U_Design Secure Backend running on http://localhost:${port}`);
  });
}

// Export the Express API for Vercel Serverless Functions
export default app;
