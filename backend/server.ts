import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Setup Multer for handling file uploads in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Firebase Admin
let db: FirebaseFirestore.Firestore | null = null;
try {
  // Option 1: Load from service account file if it exists
  if (fs.existsSync('./serviceAccountKey.json')) {
    const serviceAccount = JSON.parse(fs.readFileSync('./serviceAccountKey.json', 'utf8'));
    initializeApp({
      credential: cert(serviceAccount)
    });
    db = getFirestore();
    console.log('Firebase Admin initialized with serviceAccountKey.json');
  } 
  // Option 2: Load from env variable
  else if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
     const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
     initializeApp({
       credential: cert(serviceAccount)
     });
     db = getFirestore();
     console.log('Firebase Admin initialized with env variable');
  } else {
    console.warn('⚠️ WARNING: Firebase Admin not initialized. Missing serviceAccountKey.json or FIREBASE_SERVICE_ACCOUNT_JSON env. Security verification will be bypassed for development.');
  }
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
}

// Helper: Upload to Pinata
async function uploadToPinata(fileBuffer: Buffer, originalName: string, mimeType: string) {
  const apiKey = process.env.VITE_PINATA_API_KEY;
  const apiSecret = process.env.VITE_PINATA_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn("Pinata keys missing. Faking IPFS Hash.");
    await new Promise(r => setTimeout(r, 1000));
    return "QmSample" + Math.random().toString(36).substring(2, 15);
  }

  const formData = new FormData();
  const blob = new Blob([new Uint8Array(fileBuffer)], { type: mimeType });
  formData.append('file', blob, originalName);

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      pinata_api_key: apiKey,
      pinata_secret_api_key: apiSecret,
    },
    body: formData as any
  });

  if (!res.ok) {
    throw new Error(`Pinata upload failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.IpfsHash;
}

// Helper: Analyze with Gemini
async function analyzeWithGemini(fileBuffer: Buffer, mimeType: string) {
  const geminiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!geminiKey) {
    console.warn("Gemini key missing. Faking AI response.");
    await new Promise(r => setTimeout(r, 1500));
    return {
      artStyle: "Cyberpunk Digital Art",
      dominantColors: ["#000000", "#00FFA3"],
      mainObjects: ["Abstract shape", "Neon lights"],
      copyrightDescription: "A dark cyberpunk abstract composition featuring neon green glowing geometries."
    };
  }

  const ai = new GoogleGenAI({ apiKey: geminiKey });
  const b64Data = fileBuffer.toString('base64');

  const prompt = `Analyze this image. Detect the Art Style, Dominant Colors (use Hex Codes), Main Objects, and provide a short (1-2 sentence) copyright description. 
  Return the result strictly in JSON format with keys: artStyle, dominantColors (array of strings), mainObjects (array of strings), copyrightDescription. Do not use markdown blocks around the response.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [
        {
            role: 'user',
            parts: [
                { inlineData: { data: b64Data, mimeType: mimeType } },
                { text: prompt }
            ]
        }
    ]
  });

  let text = response.text || '';
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse Gemini output:", text);
    throw new Error("AI Analysis returned malformed data.");
  }
}

// API Endpoint: Protect Artwork
app.post('/api/protect', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const authHeader = req.headers.authorization;
    const clientUid = req.body.userId; // Fallback if no admin SDK
    
    if (!file) {
       res.status(400).json({ error: 'No file provided' });
       return;
    }

    let userId = clientUid;

    // 1. Authenticate user if Firebase Admin is setup
    if (db) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
         return;
      }
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
         res.status(401).json({ error: 'Unauthorized: Invalid token' });
         return;
      }
    } else {
      if (!userId) {
         res.status(401).json({ error: 'Unauthorized: No userId provided in development fallback' });
         return;
      }
    }

    // 2. Upload to Pinata
    const ipfsHash = await uploadToPinata(file.buffer, file.originalname, file.mimetype);

    // 3. Duplicate Check (Global Ledger)
    if (db) {
      const artworksRef = db.collection('artworks');
      const duplicateQuery = await artworksRef.where('ipfsHash', '==', ipfsHash).get();
      if (!duplicateQuery.empty) {
         res.status(409).json({ error: 'DUPLICATE', hash: ipfsHash });
         return;
      }
    }

    // 4. Analyze with Gemini
    const fingerprint = await analyzeWithGemini(file.buffer, file.mimetype);

    // 5. Save to Firestore Securely
    const timestamp = new Date().toUTCString();
    
    if (db) {
      const docId = `art_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      await db.collection('artworks').doc(docId).set({
        userId: userId,
        ipfsHash: ipfsHash,
        timestamp: timestamp,
        createdAt: FieldValue.serverTimestamp(),
        fingerprint: fingerprint,
        fileName: file.originalname,
        fileSize: file.size,
        fileType: file.mimetype
      });
    }

    // 6. Return Success
     res.status(200).json({
      success: true,
      ipfsHash,
      fingerprint,
      timestamp,
      savedSecurely: !!db
    });

  } catch (error: any) {
    console.error('Protect API Error:', error);
     res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

// Serve static frontend files in production
app.use(express.static(path.join(__dirname, '../dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
  console.log(`U_Design Secure Backend running on http://localhost:${port}`);
});
