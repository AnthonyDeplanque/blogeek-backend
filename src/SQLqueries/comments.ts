import * as mysql2 from 'mysql2';
import { Comments } from '../Blogeek-library/models/interactions/comments';

const connection = require('../db-config');
const db: mysql2.Connection = connection.promise();

const getAllCommentsQuery = () => {
  return db.query(`SELECT * FROM COMMENTS ORDER BY date_of_write DESC `);
}
const getOneCommentQuery = (id: string) => {
  return db.query(`SELECT * FROM COMMENTS WHERE id = ?`, [id]);
}

const getAllCommentsFromAnArticleQuery = (id: string) => {
  return db.query(`SELECT * FROM COMMENTS WHERE id_article= ? ORDER BY date_of_write DESC`, [id]);
}

const getAllCommentsFromAnUserQuery = (id: string) => {
  return db.query(`SELECT * FROM COMMENTS DESC WHERE id_user = ? ORDER BY date_of_write DESC`, [id])
}

const postCommentQuery = (values: Comments) => {
  return db.query(`INSERT INTO COMMENTS SET ?`, [values]);
}

const updateCommentQuery = (id: string, values: { id_article?: string, id_user?: string, content?: string }) => {
  return db.query(`UPDATE COMMENTS SETS ? WHERE id =?`, [values, id]);
}
const deleteCommentQuery = (id: string) => {
  return db.query(`DELETE FROM COMMENTS WHERE id= ? `, [id]);
}
const deleteCommentByArticleQuery = (id: string) => {
  return db.query(`DELETE FROM COMMENTS WHERE id_article=?`, [id]);
}

module.exports = { getAllCommentsFromAnArticleQuery, getAllCommentsFromAnUserQuery, getAllCommentsQuery, postCommentQuery, updateCommentQuery, deleteCommentByArticleQuery, deleteCommentQuery, getOneCommentQuery };