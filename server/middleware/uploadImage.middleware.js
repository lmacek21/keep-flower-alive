const upload = require("../utils/multer.util");
const cloudinary = require("../utils/cloudinary.util");

const uploadMiddleware = upload.single("image");

async function uploadImage(req, res, next) {
  uploadMiddleware(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return next();
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "flowers" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      req.body.image = result.secure_url;
      next();
    } catch (err) {
      return res
        .status(500)
        .json({ error: "Image upload failed", details: err.message });
    }
  });
}

module.exports = uploadImage;
