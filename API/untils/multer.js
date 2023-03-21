import multer from "multer";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const maxSizeAvatar = 5 * 1024 * 1024;

import { accessPromise } from "../helpers/fsPromises.js";
import { mkdir } from "node:fs/promises";

const fileFilter = (req, file, cb) => {
  // Функция должна вызывать `cb` с булевым значением, которое покажет следует ли принимать  файл или нет
  if (file.mimetype != "image/png" && file.mimetype != "image/gif")
    return cb(null, false);
  return cb(null, true);
};
const storageConfig = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const id = req.userID;
      // Путь куда сохраняется файл полностью прописывается
      let dir = join(__dirname, "..", "dist", "uploads", "userImg", `${id}`);
      if (!(await accessPromise(dir))) await mkdir(dir);
      cb(null, dir);
    } catch (e) {
      console.error(e);
    }
  },
  filename: (req, file, cb) => {
    console.log(file);
    const now = Date.now();
    req.uploadDate = now;
    const extenstion = file.originalname.split(".");
    const name = `${file.fieldname}-${now}.${extenstion.at(-1)}`;
    cb(null, name); // имя файла после сохранения
  },
});
export const upload = multer({
  storage: storageConfig,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxSizeAvatar,
  },
}); // установка написанных конфигов
