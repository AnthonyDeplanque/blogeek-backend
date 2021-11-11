import * as mysql2 from 'mysql2';
import { Articles } from '../Blogeek-library/models/Articles';


const connection = require('../db-config');
const db: mysql2.Connection = connection.promise();

const getSelectedArticleCategoriesQuery = (id: string) => {
  return db.query(`SELECT * FROM ARTICLE_HAS_CATEGORIES WHERE id_article = ?`, [id]);
}
const getSelectedCategoriesForArticleQuery = (id: string) => {
  return db.query(`SELECT * FROM ARTICLE_HAS_CATEGORIES WHERE id_subcategory = ?`, [id]);
}
const postArticleHasCategoriesQuery = (values: any) => {
  return db.query(`INSERT INTO ARTICLE_HAS_CATEGORIES SET ? `, [values]);
}