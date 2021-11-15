import * as express from 'express';
const { uploadImageForUser } = require("../../controllers/imageFiles");

const route = express.Router();
route.post("/uploadAvatar/:id", uploadImageForUser);

module.exports = route;