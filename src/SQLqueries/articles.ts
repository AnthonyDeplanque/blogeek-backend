import * as mysql2 from 'mysql2';
import { Articles } from '../Blogeek-library/models/Articles';


const connection = require('../db-config');
const db: mysql2.Connection = connection.promise();

const getArticlesQuery = () => {
  return db.query('SELECT * FROM ARTICLES ORDER BY date_of_write DESC');
}

const getSelectedArticlesQuery = (first: string, last: string) => {
  return db.query(`SELECT * FROM ARTICLES ORDER BY date_of_write DESC LIMIT ?, ?`, [first, last]);
}

const getOneArticleQuery = (id: string) => {
  return db.query('SELECT * FROM ARTICLES WHERE id = ? ', [id]);
}

const getOneArticleByTitleQuery = (title: string) => {
  return db.query('SELECT * FROM ARTICLES WHERE title = %?% ORDER BY date_of_write DESC', [title]);
}

const getAllArticlesFromAnUserQuery = (id: string) => {
  return db.query('SELECT * FROM ARTICLES WHERE id_user = ? ORDER BY date_of_write DESC', [id]);
}

const getSubcategoriesForArticleQuery = (id: string) => {
  return db.query(`
  SELECT ahc.id_subcategory, s.title FROM ARTICLE_HAS_CATEGORIES AS ahc 
  INNER JOIN SUBCATEGORIES AS s ON ahc.id_subcategory=s.id
  WHERE ahc.id_article=?`
    , [id])
}

const getAllArticlesFromACategoryQuery = (id: string) => {
  return db.query(`
    SELECT a.id, a.title, a.id_user, a.subtitle, a.content, a.date_of_write
    FROM ARTICLES_HAS_CATEGORIES AS ahc
    INNER JOIN ARTICLES ON ahc.id_article = a.id
    WHERE ahc.id_subcategory = ?`, [id]);
}

const postArticleQuery = (values: Articles) => {
  return db.query('INSERT INTO ARTICLES SET ?', [values]);
}

const postCategoryForArticleQuery = (values: any) => {
  return db.query('INSERT INTO ARTICLE_HAS_CATEGORIES SET ?', [values]);
}

const updateCategoryForArticleQuery = (id: string, values: Articles) => {
  return db.query('UPDATE ARTICLES_HAS_CATEGORIES SET ? WHERE id=?', [values, id]);
}

const updateArticleQuery = (id: string, values: Articles) => {
  return db.query('UPDATE ARTICLES SET ? WHERE id=?', [values, id]);
}

const deleteArticleQuery = (id: string) => {
  return db.query('DELETE FROM ARTICLES WHERE id = ?', [id]);
}

const deleteCategoryForArticleQuery = (id: string) => {
  return db.query('DELETE FROM ARTICLE_HAS_CATEGORIES WHERE id_article = ?', [id])
}

module.exports = {
  getAllArticlesFromACategoryQuery,
  getAllArticlesFromAnUserQuery,
  getArticlesQuery,
  getOneArticleQuery,
  getOneArticleByTitleQuery,
  getSelectedArticlesQuery,
  postArticleQuery,
  postCategoryForArticleQuery,
  updateArticleQuery,
  updateCategoryForArticleQuery,
  deleteArticleQuery,
  deleteCategoryForArticleQuery,
  getSubcategoriesForArticleQuery
}