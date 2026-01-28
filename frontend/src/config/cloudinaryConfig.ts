
import { Cloudinary } from '@cloudinary/url-gen';

// Cloudinary configuration
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const cld = new Cloudinary({
  cloud: {
    cloudName,
  },
});

// Upload Widget Configuration
const uwConfig = {
  cloudName,
  uploadPreset,
  sources: ['local', 'url', 'camera'],
  multiple: false,
  clientAllowedFormats: ['jpg', 'jpeg', 'tif', 'tiff', 'png', 'gif', 'webp'],
  maxImageFileSize: 2000000,
  maxImageWidth: 2000,
  // theme: 'purple',
};

export { cld, uwConfig };