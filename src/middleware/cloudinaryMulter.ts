import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../config/cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: () => ({
    folder: 'banners',
    // No 'format' property to allow all formats
    transformation: [{ width: 1200, height: 400, crop: 'limit' }],
  }),
});

const cloudinaryMulter = multer({ storage });

export default cloudinaryMulter; 