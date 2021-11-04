import * as mysql2 from 'mysql2';

const connection = require('../db-config')
const db: mysql2.Connection = connection.promise();

const getRolesQuery = () => {
  return db.query(`SELECT * FROM ROLES`);
}

const getOneRoleQueryById = (value: string) => {
  return db.query(`SELECT * FROM ROLES WHERE id = ?`, [value]);
}

const getOneRoleQueryByName = (value: string) => {
  return db.query(`SELECT * FROM ROLES WHERE name = ?`, [value]);
}

// const addRoleQuery = (values: Role) => {
//   return db.query(`INSERT INTO ROLES SET ?`, [values]);
// }
// const removeRoleQuery = (id: string) => {
//   return db.query('DELETE FROM ROLES WHERE id =?', [id]);
// }

module.exports = {
  getRolesQuery,
  getOneRoleQueryById,
  getOneRoleQueryByName,
  // addRoleQuery, 
  // removeRoleQuery 
};
