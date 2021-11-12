import * as Joi from 'joi';
import { MEDIUMTEXT } from '../../Blogeek-library/models/sqlVariables';

const postCommentValidationObject = {
  id: Joi.string().max(20).required,
  id_article: Joi.string().max(20).required,
  id_user: Joi.string().max(20).required,
  date_of_write: Joi.number().required,
  content: Joi.string().max(MEDIUMTEXT).required,
}

const updateCommentValidationObject = {
  id_article: Joi.string().max(20),
  id_user: Joi.string().max(20),
  content: Joi.string().max(MEDIUMTEXT),
}

module.exports = { postCommentValidationObject, updateCommentValidationObject };