import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

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

export { db };
