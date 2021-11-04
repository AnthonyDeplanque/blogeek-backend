import * as express from 'express';
const route = express.Router();


const { getSubCategories, getOneSubCategory, postSubCategory, updateSubCategory, deleteSubCategory, } = require('../../controllers/categories');

route.get('/', getSubCategories);
route.get(`/:id`, getOneSubCategory);
route.post('/', postSubCategory);
route.put('/:id', updateSubCategory);
route.delete('/:id', deleteSubCategory);

module.exports = route;
