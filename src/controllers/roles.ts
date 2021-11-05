import * as express from 'express';
import { ROLE, Roles } from '../../Blogeek-library/models/Role';
import { Users } from '../../Blogeek-library/models/Users';

import { ServerDetails, ServerResponses } from '../config/serverResponses';

const generateId = require("../../Blogeek-library/services/idGenerator");
const usersQueries = require('../SQLqueries/users');
const rolesToUsersQueries = require('../SQLqueries/rolesToUsers');
const rolesQueries = require('../SQLqueries/roles');


const addRoleToUser = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { role } = req.body;
  if (role === ROLE.ROLE_USER)
  {
    res.status(403).json({ message: ServerResponses.ACCESS_DENIED, detail: ServerDetails.FORBIDDEN });
  } else
  {
    await usersQueries.getOneUserQueryById(id).then(async ([[resultUser]]: [[Users]]) => {
      const finalUser = resultUser;
      await rolesQueries.getOneRoleQueryByName(role).then(async ([[resultRole]]: [[Roles]]) => {
        const finalRole = resultRole;
        await rolesToUsersQueries.getUsersFromRoleQuery(finalRole.id).then(async ([users]: [Users][]) => {
          const userIdListWithFinalRole = users.map((user: Users) => user.id);
          if (!userIdListWithFinalRole.includes(finalRole.id))
          {
            await rolesToUsersQueries.addRoleToUserQuery({ id: generateId(), id_user: id, id_role: finalRole.id }).then(([[result]]: any) => {
              res.status(201).json({ user: finalUser, role: finalRole, result: result, response: { message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK } })
            }).catch((error: unknown) => {
              console.error(error);
              res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_CREATION });
            })
          } else
          {
            res.status(403).json({ message: ServerResponses.ACCESS_DENIED, detail: ServerDetails.ALREADY_EXIST });
          }
        }).catch((err: unknown) => {
          console.error(err);
          res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
        })
      })

    }).catch((err: unknown) => {
      console.error(err);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
    })

  }
}

const removeRoleToUser = async (req: express.Request, res: express.Response) => {

  const { id } = req.params;
  const { role } = req.body;
  if (role !== ROLE.ROLE_USER)
  {
    const roleId = rolesQueries.getOneRoleQueryByName(role).then(([[result]]: [[Roles]]) => { return result })
    const promiseRoleId = Promise.resolve(roleId).then((value: any) => (value.id));
    rolesToUsersQueries.removeRoleToUserWithIdsQuery(await promiseRoleId, id).then(([result]: any) => {
      if (result.affectedRows)
      {
        res.status(200).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.DELETE_OK, user: result.affectedRows });
      }
      else
      {
        res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
      }
    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_DELETE })
    })
  } else
  {
    res.status(403).json({ message: ServerResponses.ACCESS_DENIED, detail: ServerDetails.FORBIDDEN });
  }

}
module.exports = { addRoleToUser, removeRoleToUser }