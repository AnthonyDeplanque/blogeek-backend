import * as express from 'express';
import * as Joi from 'joi';
import * as argon2 from 'argon2';
import { ServerDetails, ServerResponses } from '../Blogeek-library/config/serverResponses';
import { Users } from '../Blogeek-library/models/Users';
import { ROLE, Roles } from '../Blogeek-library/models/Role';
import { Articles } from '../Blogeek-library/models/Articles';

const generateId = require("../Blogeek-library/services/idGenerator");
const usersQueries = require('../SQLqueries/users');
const rolesToUsersQueries = require('../SQLqueries/rolesToUsers');
const rolesQueries = require('../SQLqueries/roles');
const usersMiddlewares = require('../middlewares/users');
const JWTServices = require('../Blogeek-library/services/jwt')
const articlesQueries = require('../SQLqueries/articles');


const postUser = async (req: express.Request, res: express.Response) => {
  const { nick_name, first_name, last_name, email, password, avatar, biography } = req.body;
  if (!password) {
    res.status(500).json({
      message: ServerResponses.SERVER_ERROR,
      detail: ServerDetails.NO_PASSWORD
    });
  }
  const id = generateId();
  const hashed_password = await argon2.hash(password);
  const inscription_time = Date.now();

  const { error } = Joi.object(usersMiddlewares.postUserValidationObject).validate({ id, nick_name, first_name, last_name, email, hashed_password, inscription_time, avatar, biography }, { abortEarly: false });
  if (error) {
    console.error(error);
    res.status(422).json({ validationError: error.details });
  } else {
    usersQueries.getOneUserQueryByEmail(email).then(([results]: [Users][]) => {
      if (results.length) {
        res.status(409).json({ message: ServerResponses.CONFLICT, detail: ServerDetails.EMAIL_ALREADY_USED })
      } else {
        usersQueries.getOneUserQueryByNickname(nick_name).then(([results]: [Users][]) => {
          if (results.length) {
            res.status(409).json({ message: ServerResponses.CONFLICT, detail: ServerDetails.NICKNAME_ALREADY_USED })
          } else {
            const newUser = { id, nick_name, first_name, last_name, email, hashed_password, inscription_time, avatar, biography }
            rolesQueries.getOneRoleQueryByName(ROLE.ROLE_USER).then(([[results]]: [[Roles]]) => {
              const role = results;
              usersQueries.addUserQuery(newUser).then(([_result]: [Users]) => {
                rolesToUsersQueries.addRoleToUserQuery({ id: generateId(), id_user: id, id_role: role.id }).then(([[results]]: [[Roles]]) => {
                  const name = role.name;
                  res.status(201).json({ ...newUser, roles: [name], roleToUser: results, response: { message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK } })
                }).catch((error: unknown) => {
                  console.error(error);
                  res.status(500).json({ message: ServerResponses.BAD_REQUEST, detail: ServerDetails.ERROR_CREATION, step: 'set role for user' })
                });
              }).catch((err: unknown) => {
                console.error(err);
                res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_CREATION })
              });
            }).catch((error: unknown) => {
              console.error(error);
              res.status(500).json({ message: ServerResponses.BAD_REQUEST, detail: ServerDetails.ERROR_RETRIEVING, step: 'get role by name' })
            });
          }
        }).catch((err: unknown) => {
          console.error(err);
          res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
        });
      }
    }).catch((err: unknown) => {
      console.error(err);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
    });
  }

}

const loginUser = (req: express.Request, res: express.Response) => {
  const { nick_name, password } = req.body;
  const { error } = Joi.object(
    usersMiddlewares.loginUserValidationObject)
    .validate({ nick_name, password }, { abortEarly: false });
  if (error) {
    console.error(error);
    res.status(422).json({ validationError: error.details });
  } else {
    usersQueries.getHashedPasswordByNickname(nick_name)
      .then(async ([[results]]: any) => {
        if (results) {
          argon2.verify(results.hashed_password, password).then((match: boolean) => {
            if (match) {
              usersQueries.getOneUserQueryByNickname(nick_name).then(async ([[results]]: any) => {
                const token = JWTServices.createToken(results.email);
                const articles: Articles[] = await articlesQueries.getAllArticlesFromAnUserQuery(results.id).then(([articlesList]: any[]) => {
                  return articlesList;
                });
                const roles: string[] = await rolesToUsersQueries.getRolesForUserQuery(results.id).then(([roles]: any[]) => roles.map((role: Roles) => role.name)).catch((error: unknown) => {
                  console.error(error);
                  res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING, step: 'UserHasRole' });
                });
                res.status(200).json({ ...results, roles, articles, token, message: ServerResponses.REQUEST_OK });

              });
            } else {
              res.status(401).json({ message: ServerResponses.ACCESS_DENIED });
            }
          }).catch((error: unknown) => {
            console.error(error);
            res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING });
          });
        } else {
          res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
        }
      }).catch((error: unknown) => {
        console.error(error);
        res.status(204).json({ message: ServerResponses.ACCESS_DENIED, detail: ServerDetails.CHECK_CREDENTIALS });
      });
  }
}

const getUserProfile = (req: express.Request, res: express.Response) => {
  const { token } = req.body;
  const timeStamp = Math.floor(Date.now() / 1000);
  try {
    const decodedToken = JWTServices.decodeToken(token);
    const { data, exp } = decodedToken;
    if (timeStamp < exp) {
      usersQueries.getOneUserQueryByEmail(data)
        .then(async ([[results]]: [[Users]]) => {
          const articles: Articles[] = await articlesQueries.getAllArticlesFromAnUserQuery(results.id).then(([articlesList]: any[]) => {
            return articlesList;
          });
          const roles: string[] = await rolesToUsersQueries.getRolesForUserQuery(results.id).then(([rolesList]: any[]) => rolesList.map((role: Roles) => role.name)).catch((error: unknown) => {
            console.error(error)
            res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING, step: 'UsersHasRole' });
          })
          res.status(200).json({ ...results, roles, articles, expirationTimestamp: exp * 1000, message: ServerResponses.REQUEST_OK });
        })
        .catch((error: unknown) => {
          console.error(error);
          res.status(204).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.ERROR_RETRIEVING });
        });
    } else {
      res.status(200).json({ message: ServerResponses.ACCESS_DENIED, detail: ServerDetails.RECONNECTION_NEEDED });
    }
  } catch (error: unknown) {
    console.error(error);
    res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.INVALID_TOKEN });
  }
}





const getAllUsers = async (req: express.Request, res: express.Response) => {
  const { first, last, email, nickname } = req.query;
  if (nickname && !email && !first && !last) {
    usersQueries.getOneUserQueryByNickname(nickname).then(async ([[result]]: [[Users]]) => {
      await articlesQueries.getAllArticlesFromAnUserQuery(result.id).then(([articlesList]: any[]) => {
        const articles: Articles[] = articlesList;
        result.articles = articles;
      });
      await rolesToUsersQueries.getRolesForUserQuery(result.id).then(([roleList]: any[]) => {
        const roles: string[] = roleList.map((role: Roles) => role.name);
        res.status(200).json({ result, roles });
      }).catch((error: unknown) => { res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }); })
    }).catch((_error: unknown) => {
      res.status(204).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.ERROR_RETRIEVING })
    });
  }
  else if (email && !nickname && !first && !last) {
    usersQueries.getOneUserQueryByEmail(email).then(async ([[result]]: [[Users]]) => {
      await articlesQueries.getAllArticlesFromAnUserQuery(result.id).then(([articlesList]: any[]) => {
        const articles: Articles[] = articlesList;
        result.articles = articles;
      });
      await rolesToUsersQueries.getRolesForUserQuery(result.id).then(([roleList]: any[]) => {
        const roles: string[] = roleList.map((role: Roles) => role.name);
        res.status(200).json({ result, roles });
      }).catch((error: unknown) => { res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }); })
    }).catch((_error: unknown) => {
      res.status(204).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.ERROR_RETRIEVING })
    });
  }
  else if (first && last && !nickname && !email) {
    usersQueries.getSelectedUsersQuery(+first, +last)
      .then(([results]: any[]) => {
        const promises = results.map(async (user: any) => {
          user.articles = await articlesQueries.getAllArticlesFromAnUserQuery(user.id).then(([articlesList]: any[]) => {
            return articlesList;
          });
          user.roles = await rolesToUsersQueries.getRolesForUserQuery(user.id).then(([role]: any) => {
            const roles = role.map((r: any) => {
              const { name } = r; return name;
            })
            return roles;
          })
          return user;
        })
        Promise.all(promises).then((result: any) => res.status(200).json(result));
      })
      .catch((error: any) => res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }));

  } else if (!first && !last && !nickname && !email) {
    usersQueries.getUsersQuery()
      .then(([results]: any[]) => {
        const promises = results.map(async (user: any) => {
          user.articles = await articlesQueries.getAllArticlesFromAnUserQuery(user.id).then(([articlesList]: any[]) => {
            return articlesList;
          });
          user.roles =
            await rolesToUsersQueries.getRolesForUserQuery(user.id).then(([role]: any) => {
              const roles = role.map((roleName: Roles) => {
                const { name } = roleName; return name;
              })
              return roles;
            })
          return user;
        })
        Promise.all(promises).then((result: any) => res.status(200).json(result));
      })
      .catch((error: any) => res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }));
  } else {
    res.status(500).json({ message: ServerResponses.BAD_REQUEST })
  }
}

const getOneUserById = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  await usersQueries
    .getOneUserQueryById(id)
    .then(async ([[result]]: [[Users]]) => {
      if (result) {
        result.articles = await articlesQueries.getAllArticlesFromAnUserQuery(result.id).then(([articlesList]: any[]) => {
          return articlesList;
        });
        rolesToUsersQueries.getRolesForUserQuery(result.id).then(([roleList]: any[]) => {
          const roles: [] = roleList.map((role: Roles) => role.name);
          res.status(200).json({ ...result, roles });
        }).catch((error: unknown) => { res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }); })
      } else {
        res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
      }
    }).catch((_error: unknown) => {
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING });
    })
}

const updateUser = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const validationErrors = Joi.object(usersMiddlewares.updateUserValidationObject).validate(req.body, { abortEarly: false }).error;
  usersQueries.getOneUserQueryById(id).then(([[result]]: [[Users]]) => {
    if (!result) {
      res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
    } else {
      if (validationErrors) {
        console.error(validationErrors.details[0].message);
        res.status(403).json(validationErrors);
      } else {
        usersQueries.updateUserQuery(id, req.body)
          .then(([result]: any) => {
            res.status(200).json({ result: { ...result }, message: ServerResponses.REQUEST_OK, detail: ServerDetails.UPDATE_OK });
          }).catch((error: unknown) => {
            console.error(error);
            res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error })
          })
      }
    }
  })
}

const updateUserPassword = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { password } = req.body;
  if (!password) {
    res.status(403).json({ message: ServerResponses.BAD_REQUEST, details: ServerDetails.NO_PASSWORD });
  }
  const hashed_password = password ? await argon2.hash(password) : null;
  const validationError = Joi.object(usersMiddlewares.updateUserPasswordValidationObject).validate({ hashed_password }, { abortEarly: false }).error;
  if (validationError) {
    res.status(500).json({ ...validationError });
  } else {
    usersQueries.getOneUserQueryById(id).
      then(([[result]]: [[Users]]) => {
        if (result) {
          usersQueries.updateUserQuery(id, { hashed_password })
            .then(([_result]: any) => {
              res.status(201).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.UPDATE_OK });
            }).catch((error: unknown) => {
              res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error });
            });
        } else {
          res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
        }
      }).catch((error: unknown) => {
        console.error(error);
        res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error });
      })
  }
}

const deleteUser = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  usersQueries.deleteUserQuery(id)
    .then(([result]: any) => {
      if (result.affectedRows) {
        rolesToUsersQueries.removeRoleToUserByUseridQuery(id).then(([resultRole]: any) => {
          if (resultRole.affectedRows) {
            res.status(200).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.DELETE_OK, user: result.affectedRows, roles: resultRole.affectedRows });
          }
        })
      } else {
        res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
      }
    })
    .catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING });
    });
}

module.exports = { getAllUsers, postUser, loginUser, getUserProfile, getOneUserById, updateUser, deleteUser, updateUserPassword }
