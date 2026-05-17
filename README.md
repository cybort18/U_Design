<div align="center">
  <br />
    <img src="public/logo-udesign.svg" alt="U_Design Logo" width="300" />
  <br />
  <br />
  
  **The Next Generation of Intellectual Property (IP) Protection**<br />
  <i>Empowering Digital Creators with AI Semantic Fingerprinting and Decentralized IPFS Vaults</i>

  <br />
  
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
  [![Firebase](https://img.shields.io/badge/Firebase-11.0-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
  [![Pinata](https://img.shields.io/badge/Pinata_IPFS-Storage-5D3FD3?logo=ipfs&logoColor=white)](https://pinata.cloud/)
  [![Gemini](https://img.shields.io/badge/Gemini_AI-2.5_Flash-1A73E8?logo=google&logoColor=white)](https://aistudio.google.com/)
</div>

<hr />

## 📖 Overview

**U_Design** is a cutting-edge **Intellectual Property (IP) Protection Platform** tailored for digital artists, designers, and creators. Operating at the intersection of Web 2.5 and Web 3, U_Design ensures that original digital artworks remain secure, traceable, and undeniably authentic.

By combining the immutability of decentralized storage with advanced artificial intelligence, U_Design establishes an incorruptible standard for proving artwork ownership.

## ✨ Key Features

- 🛡️ **Global Anti-Plagiarism Detection**: Uses strict global hashing checks across the entire platform. If an artwork's hash is already claimed, the system outright blocks any attempts of duplication.
- 🧊 **Immutable Decentralized Storage**: Artworks are securely pinned to the IPFS network via **Pinata**, guaranteeing that the original source files are preserved forever without the risk of centralized server tampering.
- 🧠 **AI Semantic Fingerprinting**: Powered by **Google Gemini 2.5 Flash**, the system generates a unique "Semantic Fingerprint" for every uploaded artwork. It intelligently detects the core art style, dominant color palettes, main objects, and generates a sophisticated copyright description.
- 🔐 **Secure Digital Vault**: Integrated with **Firebase Firestore & Authentication**, creators have a private, secure dashboard to manage and review all their protected assets.
- 📜 **Certificate of Authenticity**: Generates a downloadable, highly detailed cryptographic digital certificate showcasing the IPFS Content ID (CID), timestamp, AI Fingerprint data, and dynamic Creator credentials.
- 🌐 **Global Authenticity Verification**: Anyone can verify an artwork's authenticity simply by querying its IPFS CID within the platform's verification engine.

## 🛠 Tech Stack

| Domain | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, TypeScript, Framer Motion |
| **AI Engine** | Google GenAI SDK (Gemini 2.5 Flash) |
| **Web3 Storage** | Pinata (IPFS) Decentralized Network |
| **Backend & Auth** | Firebase (Firestore, Authentication) |
| **Animation & UX** | Lenis (Smooth Scroll), Framer Motion |

## 🚀 Getting Started

### Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### 1. Installation
Clone this repository and install the dependencies:
```bash
git clone https://github.com/cybort18/U_Design.git
cd U_Design
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and securely configure your API keys:

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
> **Note**: For security, your `.env` file is git-ignored by default.

### 3. Run Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to see the application in action.

## 🔒 The Protection Workflow
1. **Initiation**: A creator drags and drops their original digital artwork.
2. **Global Validation**: The file is hashed and verified against the global database to prevent plagiarism.
3. **Immutable Storage**: The verified file is pinned to IPFS, cementing its place on the decentralized web.
4. **AI Fingerprinting**: Gemini AI analyzes the image to formulate a Semantic Fingerprint.
5. **Copyright Seal**: The CID, AI data, and timestamps are recorded in the creator's secure Firebase Vault.
6. **Certificate Render**: The platform renders a premium "Verified Digital Asset" certificate that dynamically displays the creator's identity.

<br />

<div align="center">
  <img src="public/logo-company.svg" alt="Company Logo" width="60" />
  <br />
  <br />
  <p><b>Built and Powered by the Community.</b></p>
  <p>&copy; 2026 U_Design Platform. All rights reserved.</p>
</div>
