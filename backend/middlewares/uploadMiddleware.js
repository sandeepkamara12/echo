import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../helpers/cloudinary.js";
import path from "path";
import { fileURLToPath } from "url";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "myapp/images", // optional folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req, file) => Date.now() + "_" + file.originalname,
  },
});

const upload = multer({ storage });

export const uploadSingleImage = (fieldName = "image") => upload.single(fieldName);


// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Multer configuration
const storages = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/images"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// ✅ Base multer instance
const uploads = multer({
  storage: storages,
  fileFilter,
  limits: { fileSize: 1 * 1024 * 1024 }, // 5MB limit
});

// ✅ Custom middleware wrapper for clean error handling
export const uploadSingleFile = (fieldName = "file") => {
  return (req, res, next) => {
    uploads.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError || err) {
        return res.status(400).json({
          success: false,
          message: err.message || "File upload failed",
        });
      }
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }
      next();
    });
  };
};