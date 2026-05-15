# U_Design

U_Design is a cutting-edge **Intellectual Property (IP) Protection Platform** tailored for digital artists, designers, and creators. Operating at the intersection of Web 2.5 and Web 3, U_Design ensures that original digital artworks remain secure, traceable, and undeniably authentic.

By combining the immutability of decentralized storage with advanced artificial intelligence, U_Design establishes an incorruptible standard for proving artwork ownership.

## ✨ Key Features

- **Immutable Decentralized Storage**: Artworks are securely pinned to the IPFS network via **Pinata**, guaranteeing that the original source files are preserved forever without the risk of centralized server tampering.
- **AI Semantic Fingerprinting**: Powered by **Google Gemini 2.5 Flash**, the system generates a unique "Semantic Fingerprint" for every uploaded artwork. It intelligently detects the core art style, dominant color palettes, main objects, and generates a sophisticated copyright description.
- **Secure Digital Vault**: Integrated with **Firebase Firestore & Authentication**, creators have a private, secure dashboard to manage and review all their protected assets.
- **Certificate of Authenticity**: Generates a downloadable, highly detailed cryptographic digital certificate showcasing the IPFS Content ID (CID), timestamp, and AI Fingerprint data.
- **Global Authenticity Verification**: Anyone can verify an artwork's authenticity simply by querying its IPFS CID within the platform's verification engine.

## 🛠 Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion
- **AI Integration**: Google GenAI SDK (Gemini)
- **Decentralized Storage**: Pinata (IPFS)
- **Database & Auth**: Firebase (Firestore, Authentication)

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Install Dependencies
Make sure you are inside the correct project directory (`U_Design`), then run:
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory (where `vite.config.ts` is located) and configure your API keys:

```env
# GOOGLE GEMINI AI KEY
VITE_GEMINI_API_KEY="your_gemini_api_key"

# PINATA IPFS KEYS
VITE_PINATA_API_KEY="your_pinata_api_key"
VITE_PINATA_API_SECRET="your_pinata_api_secret"

# FIREBASE CONFIGURATION KEYS
VITE_FIREBASE_API_KEY="your_firebase_api_key"
VITE_FIREBASE_AUTH_DOMAIN="your_firebase_auth_domain"
VITE_FIREBASE_PROJECT_ID="your_firebase_project_id"
VITE_FIREBASE_STORAGE_BUCKET="your_firebase_storage_bucket"
VITE_FIREBASE_MESSAGING_SENDER_ID="your_firebase_messaging_sender_id"
VITE_FIREBASE_APP_ID="your_firebase_app_id"
```

### 3. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to see the application in action.

## 🔒 How It Works
1. **Upload**: A creator drags and drops their digital artwork.
2. **Process**: The file is hashed and sent to IPFS. Simultaneously, Gemini AI analyzes the image to formulate a Semantic Fingerprint.
3. **Record**: The CID, AI data, and timestamps are recorded in the creator's secure Firebase Vault.
4. **Certificate**: The platform renders a "Verified Digital Asset" certificate that can be saved locally.

---
*Built for digital creators and artists.*
