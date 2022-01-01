import * as Joi from 'joi';
import { TEXT } from '../Blogeek-library/models/sqlVariables';

const postUserValidationObject = {
  id: Joi.string().max(20).required(),
  first_name: Joi.string().max(50),
  last_name: Joi.string().max(50),
  nick_name: Joi.string().max(50).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).max(150).required(),
  hashed_password: Joi.string().max(100).required(),
  inscription_time: Joi.number().required(),
  avatar: Joi.string().max(TEXT).allow(null, ''),
  biography: Joi.string().max(TEXT).allow(null, ''),
}

const updateUserValidationObject = {
  first_name: Joi.string().max(50).allow(null, ''),
  last_name: Joi.string().max(50).allow(null, ''),
  avatar: Joi.string().max(TEXT).allow(null, ''),
  biography: Joi.string().max(TEXT).allow(null, ''),
}

const updateUserPasswordValidationObject = {
  hashed_password: Joi.string().max(100).required(),
}

const loginUserValidationObject = {
  nick_name: Joi.string().max(50).required(),
  password: Joi.string().max(100).required(),
}

module.exports = { postUserValidationObject, updateUserPasswordValidationObject, updateUserValidationObject, loginUserValidationObject }