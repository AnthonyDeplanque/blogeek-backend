require('dotenv').config();
import cors = require('cors');
import path = require('path');



import { FILE_STORAGE_ROUTE } from './config/apiRoutes';
import { router } from './routes/index';
const express = require('express');
const app = express();

const port = process.env.PORT || 1234;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(express.json());
app.use(FILE_STORAGE_ROUTE, express.static('file-storage'));

router(app);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

