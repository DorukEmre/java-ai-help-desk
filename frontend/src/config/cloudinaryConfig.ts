
import { Cloudinary } from '@cloudinary/url-gen';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const cloudinary = new Cloudinary({
  cloud: {
    cloudName,
  },
});

const cloudinaryConfig = {
  cloudName,
  uploadPreset
}

export { cloudinary, cloudinaryConfig };