const BaseController = require("../base");
const express = require("express");
const router = express.Router();
const {
  memory: multerMemory,
  disk: multerDisk,
} = require("../../middlewares/upload");
const { uploader } = require("../../helpers/cloudinary");

class UploadController extends BaseController {
  constructor() {
    super();
    router.post("/", multerMemory.single("file"), this.upload);
    router.post("/local", multerDisk.single("file"), this.uploadDisk);
  }
  uploadDisk = async (req, res, next) => {
    try {
      const { file } = req;
      const size = req.file.size;
      const maxSizeInMB = 1;
      const maxSize = maxSizeInMB * 1024 * 1024;
      if (size > maxSize) {
        return next(new ValidationError("File size too large"));
      }

      const allowedMimeTypes = [
        "image/jpeg", // jpg
        "image/png", // png
        "image/webp", // webp
        "application/pdf", // pdf
        "application/msword", // doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/vnd.ms-powerpoint", // ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
        "application/vnd.ms-excel", // xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return next(new ValidationError("File type not allowed"));
      }

      const proxyHost = req.headers["x-forwarded-host"] || req.headers.host;

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "File uploaded successfully",
          data: {
            uri: `http://${proxyHost}/public/uploads/${file.filename}`,
          },
        })
      );
    } catch (error) {
      return next(new ServerError(error));
    }
  };

  upload = async (req, res, next) => {
    try {
      const { file } = req;
      const size = req.file.size;
      const maxSizeInMB = 1;
      const maxSize = maxSizeInMB * 1024 * 1024;
      if (size > maxSize) {
        return next(new ValidationError("File size too large"));
      }

      const allowedMimeTypes = [
        "image/jpeg", // jpg
        "image/png", // png
        "image/webp", // webp
        "application/pdf", // pdf
        "application/msword", // doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
        "application/vnd.ms-powerpoint", // ppt
        "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
        "application/vnd.ms-excel", // xls
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
      ];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return next(new ValidationError("File type not allowed"));
      }
      const fileBase64 = file.buffer.toString("base64");
      const fileDataUri = `data:${file.mimetype};base64,${fileBase64}`;

      const fileUpload = await uploader.upload(fileDataUri, {
        upload_preset: "car-rental",
        resource_type: "auto",
        aspect_ratio: "1.0",
        height: 200,
        crop: "lfill",
      });

      return res.status(200).json(
        this.apiSend({
          code: 200,
          status: "success",
          message: "File uploaded successfully",
          data: {
            url: fileUpload.secure_url,
            width: fileUpload.width,
            height: fileUpload.height,
            format: fileUpload.format,
            resource_type: fileUpload.resource_type,
          },
        })
      );
    } catch (error) {
      next(new ServerError(error));
    }
  };
}

new UploadController(); // Untuk initialize router dan agar bisa memanggil constructor

module.exports = router; // Untuk export router
