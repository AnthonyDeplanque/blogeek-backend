import * as express from 'express';
import { SUBCATEGORIES_ROUTE } from '../../Blogeek-library/config/apiRoutes';


const { getAllArticles, getOneArticle, postArticle, updateArticle, deleteArticle, postASubategoryForArticle } = require('../../controllers/articles');
const route = express.Router();

route.get('/', getAllArticles);
route.get('/:id', getOneArticle);
route.post('/', postArticle);
route.put('/:id', updateArticle);
route.delete('/:id', deleteArticle);
route.post(SUBCATEGORIES_ROUTE, postASubategoryForArticle);

module.exports = route;