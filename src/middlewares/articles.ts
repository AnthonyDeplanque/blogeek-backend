import * as Joi from 'joi';

const postArticleValidationObject = {
  id: Joi.string().max(20).required(),
  id_user: Joi.string().max(20).required(),
  title: Joi.string().max(255).required(),
  subtitle: Joi.string().max(255).required(),
  content: Joi.string().required(),
  date_of_write: Joi.number().required(),
};

const updateArticleValidationObject = {
  title: Joi.string().max(255),
  subtitle: Joi.string().max(255),
  content: Joi.string(),
};

const postArticleHasCategoriesValidationObject = {
  id: Joi.string().max(20).required(),
  id_Article: Joi.string().max(20).required(),
  id_subCategory: Joi.string().max(20).required(),
};

module.exports = {
  postArticleValidationObject,
  postArticleHasCategoriesValidationObject,
  updateArticleValidationObject,
};