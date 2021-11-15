import * as express from 'express'
const multer = require("multer");

const storageForNews = multer.diskStorage({
  destination(_req: express.Request, _file: any, cb: Function) {
    cb(null, "file-storage/public/images");
  },
  filename(_req: express.Request, file: any, cb: Function) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const storageForUsers = multer.diskStorage({
  destination(_req: express.Request, _file: any, cb: Function) {
    cb(null, "file-storage/public/avatar");
  },
  filename(_req: express.Request, file: any, cb: Function) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

module.exports = { storageForNews, storageForUsers };