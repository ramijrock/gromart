import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

function getCloudinaryMulter(folder: string) {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: () => ({
      folder,
      transformation: [{ width: 1200, height: 400, crop: 'limit' }],
    }),
  });
  return multer({ storage });
} 

export default getCloudinaryMulter;