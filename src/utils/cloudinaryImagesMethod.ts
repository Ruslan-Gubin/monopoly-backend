import { cloudinary } from "../config/cloudinary.js";
import { ICloudinaryImage } from "../types/index.js";

const cloudinaryImagesMethod = async (file: string, folder: string): Promise<ICloudinaryImage> => {
return new Promise<ICloudinaryImage>((resolve, reject) => {
  cloudinary.uploader.upload(file, {folder}, (err, res) => {
    if (err || !res) {
      reject(new Error('upload image error'));
      return;
    }
    resolve({
      public_id: res.public_id,
      url: res.secure_url
    });
  });
});
}

const cloudinaryImagesRemove = async (imag: string): Promise<void> => {
 await cloudinary.uploader.destroy(imag, (err, res) => {
    if (err) return res.status(500).send('destroy image error')
  })
}

export { cloudinaryImagesMethod, cloudinaryImagesRemove }