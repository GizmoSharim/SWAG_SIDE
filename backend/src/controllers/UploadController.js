const cloudinary = require('cloudinary').v2;
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const AppError = require('../utils/AppError');

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret
});

const UploadController = {
  uploadImages: asyncHandler(async (req, res) => {
    if (!env.cloudinary.cloudName || !env.cloudinary.apiKey || !env.cloudinary.apiSecret) {
      throw new AppError('Cloudinary nao configurado', 503, 'CLOUDINARY_NOT_CONFIGURED');
    }

    const files = req.files || [];
    if (!files.length) {
      throw new AppError('Nenhuma imagem enviada', 400, 'UPLOAD_EMPTY');
    }

    const uploads = await Promise.all(files.map((file) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'sweg-side/products', resource_type: 'image' },
          (error, result) => {
            if (error) return reject(error);
            return resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height
            });
          }
        );

        stream.end(file.buffer);
      })
    ));

    return res.status(201).json({ images: uploads });
  })
};

module.exports = UploadController;
