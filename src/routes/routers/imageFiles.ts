import { Router } from 'express';
const { uploadImageForUser } = require("../../controllers/imageFiles");

const route = Router();
route.post("/uploadAvatar/:id", uploadImageForUser);

module.exports = route;