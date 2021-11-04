import * as express from 'express';


const { getAllArticles, getOneArticle, postArticle, updateArticle, deleteArticle } = require('../../controllers/articles');
const route = express.Router();

route.get('/', getAllArticles);
route.get('/:id', getOneArticle);
route.post('/', postArticle);
route.put('/:id', updateArticle);
route.delete('/:id', deleteArticle);

module.exports = route;
