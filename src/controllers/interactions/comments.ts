import * as Joi from 'joi';
import * as express from "express";
import { ServerDetails, ServerResponses } from '../../Blogeek-library/config/serverResponses';
import { Comments } from '../../Blogeek-library/models/interactions/comments';
const commentsQueries = require('../../SQLqueries/comments');
const commentsMiddlewares = require('../../middlewares/interactions/comments');
const generateId = require("../Blogeek-library/services/idGenerator");

const postComment = (req: express.Request, res: express.Response) => {
  const id = generateId();
  const { id_article, id_user, content } = req.body;
  const date_of_write = Date.now();
  const newComment = { id, id_article, id_user, date_of_write, content };

  const { error } = Joi.object(commentsMiddlewares.postCommentValidationObject).validate(newComment, { abortEarly: false });
  if (error)
  {
    console.error(error);
    res.status(422).json({ validationError: error.details });
  } else
  {
    commentsQueries.postCommentQuery(newComment).then(([[result]]: any) => {
      res.status(201).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK, newComment, result })
    })
      .catch((error: unknown) => {
        console.error(error);
        res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_CREATION });
      })
  }
}

const updateComment = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { error } = Joi.object(commentsMiddlewares.updateCommentValidationObject).validate(req.body, { abortEarly: false });
  if (error)
  {
    console.error(error);
    res.status(422).json({ validationError: error.details });
  } else
  {

    commentsQueries.getOneCommentQuery(id).then(([[result]]: any) => {
      if (result)
      {
        commentsQueries.updateCommentQuery(id, req.body).then(([[result]]: any) => {
          res.status(204).json({
            message: ServerResponses.REQUEST_OK,
            detail: ServerDetails.UPDATE_OK,
            result
          })
        }).catch((error: unknown) => {
          console.error(error);
          res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_UPDATE })
        })
      } else
      {
        res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA })
      }
    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({
        message: ServerResponses.SERVER_ERROR,
        detail: ServerDetails.ERROR_RETRIEVING
      });
    })
  }
}
const getComments = (_req: express.Request, res: express.Response) => {
  commentsQueries.getAllCommentsQuery().then(([results]: [Comments][]) => {
    res.status(200).json(results);
  }).catch((error: unknown) => {
    console.error(error)
    res.status(500).json({
      message: ServerResponses.SERVER_ERROR,
      detail: ServerDetails.ERROR_RETRIEVING
    })
  })
}

const deleteComment = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  commentsQueries.getOneCommentQuery(id).then(([[results]]: [[Comments]]) => {
    if (results)
    {
      commentsQueries.deleteCommentQuery(id).then(([results]: any) => {
        if (results.affectedRows)
        {
          res.status(204).json({
            message: ServerResponses.REQUEST_OK,
            details: ServerDetails.DELETE_OK
          })
        } else
        {
          res.status(404).json({
            message: ServerResponses.NOT_FOUND,
            details: ServerDetails.NO_DATA
          })
        }
      }).catch((error: unknown) => {
        console.error(error);
        res.status(500).json({
          message: ServerResponses.SERVER_ERROR,
          detail: ServerDetails.ERROR_RETRIEVING
        })
      })
    } else
    {
      res.status(404).json({
        message: ServerResponses.NOT_FOUND,
        details: ServerDetails.NO_DATA
      })
    }
  }).catch((error: unknown) => {
    console.error(error);
    res.status(500).json({
      message: ServerResponses.SERVER_ERROR,
      detail: ServerDetails.ERROR_RETRIEVING
    });
  })
}

module.exports = {
  getComments, postComment, updateComment, deleteComment
}