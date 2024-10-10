const multer = require("multer");
const path = require("path");
const publicPath = path.join(__dirname, "../../public");
const uploadPath = path.join(publicPath, "uploads");

const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    );
  },
});

module.exports = {
  memory: multer({ storage: memoryStorage }),
  disk: multer({ storage: diskStorage }),
};
