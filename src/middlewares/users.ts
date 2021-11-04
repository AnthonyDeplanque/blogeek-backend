import * as Joi from 'joi';

const postUserValidationObject = {
  id: Joi.string().max(20).required(),
  first_name: Joi.string().max(50),
  last_name: Joi.string().max(50),
  nick_name: Joi.string().max(50).required(),
  email: Joi.string().email({ minDomainSegments: 2 }).max(150).required(),
  hashed_password: Joi.string().max(100).required(),
  inscription_time: Joi.number().required(),
  avatar: Joi.string().max(250).allow(null, ''),
  biography: Joi.string().max(250).allow(null, ''),
}

const updateUserValidationObject = {
  first_name: Joi.string().max(50),
  last_name: Joi.string().max(50),
  nick_name: Joi.string().max(50),
  email: Joi.string().email({ minDomainSegments: 2 }).max(150),
  avatar: Joi.string().max(250).allow(null, ''),
  biography: Joi.string().max(250).allow(null, ''),
}

const updateUserPasswordValidationObject = {
  hashed_password: Joi.string().max(100).required(),
}

const loginUserValidationObject = {
  nick_name: Joi.string().max(50).required(),
  password: Joi.string().max(100).required(),
}

module.exports = { postUserValidationObject, updateUserPasswordValidationObject, updateUserValidationObject, loginUserValidationObject }