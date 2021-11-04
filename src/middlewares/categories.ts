import * as Joi from 'joi';

const postCategoryValidationObject = {
  id: Joi.string().max(20).required(),
  title: Joi.string().max(255).required(),
}
const updateCategoryValidationObject = {
  title: Joi.string().max(255),
}
const postSubCategoryValidationObject = {
  id: Joi.string().max(20).required(),
  id_category: Joi.string().max(20).required(),
  title: Joi.string().max(255).required(),
}
const updateSubCategoryValidationObject = {
  title: Joi.string().max(255),
}

module.exports = { postCategoryValidationObject, postSubCategoryValidationObject, updateCategoryValidationObject, updateSubCategoryValidationObject };