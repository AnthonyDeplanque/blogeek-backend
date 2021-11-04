import * as mysql2 from 'mysql2';
import { Categories, SubCategories } from '../../Blogeek-library/models/Categories';

const connection = require('../db-config');
const db: mysql2.Connection = connection.promise();

const getCategoriesQuery = () => {
  return db.query('SELECT * FROM CATEGORIES');
}
const getOneCategoryQuery = (id: string) => {
  return db.query('SELECT * FROM CATEGORIES WHERE id = ?', [id]);
}
const getOneCategoryByTitle = (title: string) => {
  return db.query('SELECT * FROM CATEGORIES WHERE title=?', [title]);
}
const getOneSubCategoryByTitle = (title: string) => {
  return db.query('SELECT * FROM SUBCATEGORIES WHERE title=?', [title]);
}
const getSubCategoriesFromIdCategoryQuery = (id: string) => {
  return db.query('SELECT * FROM SUBCATEGORIES WHERE id_category = ?', [id]);
}
const getOneSubCategoryQuery = (id: string) => {
  return db.query('SELECT * FROM SUBCATEGORIES WHERE id = ?', [id]);
}
const getSubCategoriesQuery = () => {
  return db.query('SELECT * FROM SUBCATEGORIES');
}
const postOneCategoryQuery = (values: Categories) => {
  return db.query('INSERT INTO CATEGORIES SET ?', [values]);
}
const postOneSubCategoryQuery = (values: SubCategories) => {
  return db.query('INSERT INTO SUBCATEGORIES SET ?', [values]);
}
const updateOneCategoryQuery = (id: string, values: any) => {
  return db.query('UPDATE CATEGORIES SET ? WHERE id = ?', [values, id]);
}
const updateOneSubCategoryQuery = (id: string, values: any) => {
  return db.query('UPDATE SUBCATEGORIES SET ? WHERE id = ?', [values, id]);
}
const deleteCategoryQuery = (id: string) => {
  return db.query('DELETE FROM CATEGORIES WHERE id=?', [id]);
}
const deleteSubCategoryQuery = (id: string) => {
  return db.query('DELETE FROM SUBCATEGORIES WHERE id=?', [id]);
}
const deleteSubCategoriesFromIdCategoryQuery = (id: string) => {
  return db.query('DELETE FROM SUBCATEGORIES WHERE id_category=?', [id]);
}

const deleteCategoryForArticleQuery = (id: string) => {
  return db.query('DELETE FROM ARTICLE_HAS_CATEGORIES WHERE id_subcategory = ?', [id])
}

module.exports = {
  getCategoriesQuery,
  getOneCategoryQuery,
  getSubCategoriesFromIdCategoryQuery,
  getOneSubCategoryQuery,
  getSubCategoriesQuery,
  getOneCategoryByTitle,
  getOneSubCategoryByTitle,
  postOneCategoryQuery,
  postOneSubCategoryQuery,
  updateOneCategoryQuery,
  updateOneSubCategoryQuery,
  deleteCategoryQuery,
  deleteSubCategoriesFromIdCategoryQuery,
  deleteSubCategoryQuery,
  deleteCategoryForArticleQuery
}