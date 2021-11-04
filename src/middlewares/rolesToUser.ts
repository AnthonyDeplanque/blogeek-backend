import * as Joi from 'joi';

const addRoleToUserValidationObject = {
  nick_name: Joi.string().max(50).required(),
  role: Joi.string().max(50).required(),
}

module.exports = { addRoleToUserValidationObject };