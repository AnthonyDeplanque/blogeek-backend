import { Router } from 'express';


const { getCategories, getOneCategory, postCategory, updateCategory, deleteCategory } = require('../../controllers/categories');
const route: Router = Router();

route.get('/', getCategories);
route.get('/:id', getOneCategory);
route.post('/', postCategory);
route.put('/:id', updateCategory);
route.delete('/:id', deleteCategory);


module.exports = route;

