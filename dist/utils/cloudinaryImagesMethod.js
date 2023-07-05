import { cloudinary } from "../config/cloudinary.js";
const cloudinaryImagesMethod = async (file, folder) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file, { folder }, (err, res) => {
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
};
const cloudinaryImagesRemove = async (imag) => {
    await cloudinary.uploader.destroy(imag, (err, res) => {
        if (err)
            return res.status(500).send('destroy image error');
    });
};
export { cloudinaryImagesMethod, cloudinaryImagesRemove };
