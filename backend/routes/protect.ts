import express from 'express';
import multer from 'multer';
import rateLimit from 'express-rate-limit';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { db } from '../config/firebase';
import { uploadToPinata, unpinFromPinata } from '../services/pinataService';
import { analyzeWithGemini } from '../services/geminiService';

const router = express.Router();

// Rate Limiter: Max 5 uploads per 15 minutes per IP
const protectLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { error: 'Too many upload requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Setup Multer with Disk Storage to prevent OOM
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, os.tmpdir()); // Use /tmp for Cloud Run compatibility
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Helper to cleanup temporary file
const cleanupFile = (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('Failed to cleanup temp file:', err);
  }
};

router.post('/', protectLimiter, upload.single('file'), async (req, res) => {
  const file = req.file;
  
  if (!file) {
    res.status(400).json({ error: 'No file provided' });
    return;
  }

  try {
    const authHeader = req.headers.authorization;
    const clientUid = req.body.userId;
    let userId = clientUid;

    // 1. Authenticate user
    if (db) {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
         cleanupFile(file.path);
         return;
      }
      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await getAuth().verifyIdToken(token);
        userId = decodedToken.uid;
      } catch (error) {
         res.status(401).json({ error: 'Unauthorized: Invalid token' });
         cleanupFile(file.path);
         return;
      }
    } else if (!userId) {
       res.status(401).json({ error: 'Unauthorized: No userId provided in development fallback' });
       cleanupFile(file.path);
       return;
    }

    // 2. Upload to Pinata
    const ipfsHash = await uploadToPinata(file.path, file.originalname, file.mimetype);

    // 3. Duplicate Check
    if (db) {
      const artworksRef = db.collection('artworks');
      const duplicateQuery = await artworksRef.where('ipfsHash', '==', ipfsHash).get();
      if (!duplicateQuery.empty) {
         res.status(409).json({ error: 'DUPLICATE', hash: ipfsHash });
         cleanupFile(file.path);
         return;
      }
    }

    // 4. Analyze with Gemini
    const fingerprint = await analyzeWithGemini(file.path, file.mimetype);

    // 5. Save to Firestore
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

    // Clean up tmp file
    cleanupFile(file.path);

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
    if (file) cleanupFile(file.path);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const artworkId = req.params.id;
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  if (!db) {
    res.status(503).json({ error: 'Database not initialized' });
    return;
  }
  
  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await getAuth().verifyIdToken(token);
    const userId = decodedToken.uid;
    
    const docRef = db.collection('artworks').doc(artworkId);
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      res.status(404).json({ error: 'Artwork not found' });
      return;
    }
    
    const data = docSnap.data();
    if (data?.userId !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    
    if (data?.ipfsHash) {
      await unpinFromPinata(data.ipfsHash);
    }
    
    await docRef.delete();
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Delete API Error:', error);
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
});

export default router;
