import fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config();

export async function uploadToPinata(filePath: string, originalName: string, mimeType: string): Promise<string> {
  const apiKey = process.env.VITE_PINATA_API_KEY;
  const apiSecret = process.env.VITE_PINATA_API_SECRET;

  if (!apiKey || !apiSecret) {
    console.warn("Pinata keys missing. Faking IPFS Hash.");
    await new Promise(r => setTimeout(r, 1000));
    return "QmSample" + Math.random().toString(36).substring(2, 15);
  }

  const fileBuffer = fs.readFileSync(filePath);
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
