import { cloudinaryConfig } from '@/config/cloudinaryConfig';
import type { AxiosInstance } from 'axios';


export const validateImage = (imageFile: File | undefined)
  : boolean => {

  if (!imageFile)
    return false;

  // Validate
  if (!imageFile.type.startsWith("image/"))
    throw new Error("Only image files are allowed");

  const MAX_SIZE_BYTES = 2 * 1024 * 1024;
  if (imageFile.size > MAX_SIZE_BYTES)
    throw new Error("File exceeds 2MB limit");

  return true;
}

export const uploadToCloudinary = async (file: File, authApi: AxiosInstance)
  : Promise<string> => {

  // get signature
  const paramsToSign: Record<string, any> = {
    timestamp: Math.floor(Date.now() / 1000),
    upload_preset: cloudinaryConfig.uploadPreset
  };

  const signatureResponse = await authApi.post(
    '/cloudinary/signature',
    { paramsToSign }
  );

  const { signature, apiKey } = signatureResponse.data;

  // build FormData
  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', apiKey);
  formData.append('timestamp', paramsToSign.timestamp.toString());
  formData.append('signature', signature);
  formData.append('upload_preset', paramsToSign.upload_preset);

  // upload to cloudinary
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`;
  const res = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Cloudinary upload failed: ${text}`);
  }

  const data = await res.json();
  return data.public_id;
};
