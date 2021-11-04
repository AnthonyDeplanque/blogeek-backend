import * as mysql2 from 'mysql2';

const connection = require('../db-config');
const db: mysql2.Connection = connection.promise();

const addRoleToUserQuery = (values: any) => {
  return db.query(`INSERT INTO USER_HAS_ROLES SET ?`, [values]);
}
const removeRoleToUserQuery = (id: string) => {
  return db.query(`DELETE FROM USER_HAS_ROLES WHERE id=?`, [id]);
}
const removeRoleToUserWithIdsQuery = (id_role: string, id_user: string) => {
  return db.query(`DELETE FROM USER_HAS_ROLES WHERE id_role=? AND id_user=?`, [id_role, id_user]);
}
const removeRoleToUserByUseridQuery = (id: string) => {
  return db.query(`DELETE FROM USER_HAS_ROLES WHERE id_user=?`, [id]);
}
const getRolesForUserQuery = (idUser: string) => {
  return db.query(`SELECT r.name FROM USER_HAS_ROLES as uar INNER JOIN ROLES AS r ON uar.id_role = r.id WHERE id_user=?`, [idUser]);
}
const getUsersFromRoleQuery = (idRole: string) => {
  return db.query(`SELECT u.id FROM USER_HAS_ROLES as uar INNER JOIN USERS AS u ON uar.id_user = u.id WHERE id_role=?`, [idRole]);
}
const getIterationsForUserRolesQuery = () => {
  return db.query('SELECT * FROM USER_HAS_ROLES');
}


module.exports = {
  addRoleToUserQuery,
  removeRoleToUserQuery,
  removeRoleToUserWithIdsQuery,
  removeRoleToUserByUseridQuery,
  getRolesForUserQuery,
  getUsersFromRoleQuery,
  getIterationsForUserRolesQuery
}