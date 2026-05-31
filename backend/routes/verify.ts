import express from 'express';
import { db } from '../config/firebase.js';

const router = express.Router();

router.get('/:ipfsHash', async (req, res) => {
  const ipfsHash = req.params.ipfsHash;
  if (!ipfsHash) {
     res.status(400).json({ error: 'Missing ipfsHash' });
     return;
  }
  
  if (!db) {
     res.status(503).json({ error: 'Database not initialized in development' });
     return;
  }
  
  try {
    const artworksRef = db.collection('artworks');
    const querySnapshot = await artworksRef.where('ipfsHash', '==', ipfsHash).get();
    
    if (querySnapshot.empty) {
       res.status(404).json({ error: 'Not found in U_Design Ledger' });
       return;
    }
    
    const data = querySnapshot.docs[0].data();
    
    // Return public verification data
    res.status(200).json({
      ipfsHash: data.ipfsHash,
      fingerprint: data.fingerprint,
      timestamp: data.timestamp,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileType: data.fileType,
      ownerId: data.userId // Let the frontend know who owns it
    });
  } catch (err: any) {
    console.error('Verify API Error:', err);
     res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
