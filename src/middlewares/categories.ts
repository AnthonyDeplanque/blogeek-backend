import * as Joi from 'joi';
import { TINYTEXT } from '../Blogeek-library/models/sqlVariables';

const postCategoryValidationObject = {
  id: Joi.string().max(20).required(),
  title: Joi.string().max(TINYTEXT).required(),
}
const updateCategoryValidationObject = {
  title: Joi.string().max(TINYTEXT),
}
const postSubCategoryValidationObject = {
  id: Joi.string().max(20).required(),
  id_category: Joi.string().max(20).required(),
  title: Joi.string().max(TINYTEXT).required(),
}
const updateSubCategoryValidationObject = {
  title: Joi.string().max(TINYTEXT),
}

module.exports = { postCategoryValidationObject, postSubCategoryValidationObject, updateCategoryValidationObject, updateSubCategoryValidationObject };