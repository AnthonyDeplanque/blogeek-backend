const multer = require("multer");



const { storageForArticles, storageForUsers } = require("../services/multer");
const uploadArticles = multer({ storageForArticles }).single("file");
const uploadAvatar = multer({ storageForUsers }).single("file");

const uploadImageForArticles = (req: any, res: any) => {
  uploadArticles(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      console.error(err);
      res.status(500).json(err);
    } else if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      const { path } = req.file;
      // SQL QUERY updateNewsQuery(id, { image: path });
      res.status(200).send(req.file);
    }
  });
};
const uploadImageForUser = (req: any, res: any) => {
  uploadAvatar(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      console.error(err);
      res.status(500).json(err);
    } else if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      const { id } = req.params;
      const { path } = req.file;
      // SQL QUERY users.updateUserQuery(id, { image: path });
      res.status(200).send(req.file);
    }
  });
};

module.exports = { uploadImageForArticles, uploadImageForUser };