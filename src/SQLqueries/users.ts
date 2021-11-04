import { Users } from "../models/Users";
import * as mysql2 from 'mysql2';

const connection = require('../db-config');
const db: mysql2.Connection = connection.promise();

const addUserQuery = (values: Users) => {
  return db.query(`INSERT INTO USERS SET ? `, [values]);
}

const getUsersQuery = () => {
  return db.query(`SELECT id, nick_name, email, first_name, last_name, inscription_time, biography, avatar FROM USERS ORDER BY inscription_time`);
}

const getOneUserQueryById = (value: string) => {
  return db.query(`SELECT id, nick_name, email, first_name, last_name, inscription_time, biography, avatar FROM USERS WHERE id = ?`, [value]);
}

const getOneUserQueryByNickname = (value: string) => {
  return db.query(`SELECT id, nick_name, email, first_name, last_name, inscription_time, biography, avatar FROM USERS WHERE nick_name = ?`, [value]);
}

const getOneUserQueryByEmail = (value: string) => {
  return db.query(`SELECT id, nick_name, email, first_name, last_name, inscription_time, biography, avatar FROM USERS WHERE email = ?`, [value]);
}

const getHashedPasswordByEmail = (value: string) => {
  return db.query(`SELECT hashed_password FROM USERS WHERE email = ?`, [value]);
}
const getHashedPasswordByNickname = (value: string) => {
  return db.query(`SELECT hashed_password FROM USERS WHERE nick_name = ?`, [value]);
}

const getSelectedUsersQuery = (first: number, last: number) => {
  return db.query(`SELECT id, nick_name, email, first_name, last_name, inscription_time, biography, avatar FROM USERS ORDER BY inscription_time LIMIT ?, ?`, [first, last]);
}

const updateUserQuery = (id: string, values: any) => {
  return db.query(`UPDATE USERS SET ? WHERE id = ?`, [values, id]);
}

const deleteUserQuery = (id: string) => {
  return db.query(`DELETE FROM USERS WHERE ID = ?`, [id]);
}

module.exports = {
  addUserQuery,
  getUsersQuery,
  getOneUserQueryById,
  getOneUserQueryByEmail,
  getOneUserQueryByNickname,
  getHashedPasswordByEmail,
  getHashedPasswordByNickname,
  getSelectedUsersQuery,
  updateUserQuery,
  deleteUserQuery,
}