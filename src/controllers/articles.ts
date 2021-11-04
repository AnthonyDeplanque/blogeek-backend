import * as Joi from 'joi';
import * as express from "express";
import { ServerDetails, ServerResponses } from '../config/serverResponses';
import { generateId } from '../services/idGenerator';
import { Articles } from '../models/Articles';
import { Users } from '../models/Users';

const articlesQueries = require('../SQLqueries/articles');
const articlesMiddlewares = require("../middlewares/articles");
const usersQueries = require('../SQLqueries/users');

const getAllArticles = async (req: express.Request, res: express.Response) => {
  const { first, last, title, user } = req.params;

  if (first && last && !title && !user)
  {
    articlesQueries.getSelectedArticlesQuery(+first, +last).then(([results]: [Articles][]) => {
      res.status(200).json(results)
    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({
        message: ServerResponses.SERVER_ERROR,
        detail: ServerDetails.ERROR_RETRIEVING
      })
    })
  }
  else if (title && !first && !last && !user)
  {
    articlesQueries.getOneArticleByTitleQuery(title).then(([[result]]: [[Articles]]) => {
      if (result)
      {
        res.status(200).json(result)
      } else
      {
        res.status(404).json({
          message: ServerResponses.NOT_FOUND,
          ServerDetails: ServerDetails.NO_DATA
        })
      }
    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({
        message: ServerResponses.SERVER_ERROR,
        detail: ServerDetails.ERROR_RETRIEVING
      })
    })
  }
  else if (user && !first && !last && !title)
  {
    articlesQueries.getAllArticlesFromAnUserQuery(user).then(([results]: [Articles][]) => {
      if (results.length)
      {
        res.status(200).json(results)
      } else
      {
        res.status(404).json({
          message: ServerResponses.NOT_FOUND,
          ServerDetails: ServerDetails.NO_DATA
        })
      }
    })
      .catch((error: unknown) => {
        console.error(error);
        res.status(500).json({
          message: ServerResponses.SERVER_ERROR,
          detail: ServerDetails.ERROR_RETRIEVING
        })
      })
  }
  else if (!user && !first && !last && !title)
  {
    const articles = await articlesQueries.getArticlesQuery().then(async ([results]: [any][]) => {
      await results.map(async (article: Articles, index: number) => {
        await usersQueries.getOneUserById(article.id_user).then(async ([[resUser]]: [[Users]]) => {
          results[index].creator = await resUser;
        })
      })
      res.status(200).json(articles)
    })
      .catch((error: unknown) => {
        console.error(error);
        res.status(500).json({
          message: ServerResponses.SERVER_ERROR,
          detail: ServerDetails.ERROR_RETRIEVING
        })
      })
  } else
  {
    res.status(500).json({
      message: ServerResponses.BAD_REQUEST,
      detail: ServerDetails.ERROR_RETRIEVING
    })
  }
};

const getOneArticle = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  articlesQueries.getOneArticleQuery(id).then(([[result]]: [[Articles]]) => {
    res.status(200).json({ result });
  }).catch((error: unknown) => {
    console.error(error);
    res.status(500).json({
      message: ServerResponses.SERVER_ERROR,
      detail: ServerDetails.ERROR_RETRIEVING
    })
  })
}

const postArticle = (req: express.Request, res: express.Response) => {
  const id = generateId();
  const { id_user, title, subtitle, content } = req.body;
  const date_of_write = Date.now();
  const { error } = Joi.object(articlesMiddlewares.postArticleValidationObject).validate({ id, id_user, title, subtitle, content, date_of_write }, { abortEarly: false });
  if (error)
  {
    res.status(422).json({ validationError: error.details });
  } else
  {
    const newArticle = { id, id_user, title, subtitle, content, date_of_write };
    articlesQueries.postArticleQuery(newArticle).then(([[result]]: any) => {
      res.status(401).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK, newArticle, result });
    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_CREATION });
    })
  }
}

const postASubategoryForArticle = (req: express.Request, res: express.Response) => {
  const id = generateId();
  const { id_article, id_subcategory } = req.body;
  const categoryForArticle = { id, id_article, id_subcategory }
  articlesQueries.postASubategoryForArticle(categoryForArticle).then(([[results]]: any) => {
    res.status(401).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK, categoryForArticle, results });
  }).catch((error: unknown) => {
    console.error(error);
    res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_CREATION });
  })
}

const updateArticle = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { error } = Joi.object(articlesMiddlewares.updateArticleValidationObject).validate(req.body, { abortEarly: false });
  if (error)
  {
    res.status(422).json({ validationError: error.details });
  } else
  {
    articlesQueries.getOneArticleQuery(id).then(([[result]]: [[Articles]]) => {
      if (result)
      {
        articlesQueries.updateArticleQuery(req.body).then(([[result]]: any) => {
          res.status(403).json({
            message: ServerResponses.REQUEST_OK,
            detail: ServerDetails.UPDATE_OK,
            result
          })
        }).catch((error: unknown) => {
          console.error(error);
          res.status(500).json({
            message: ServerResponses.SERVER_ERROR,
            detail: ServerDetails.ERROR_UPDATE,
          })
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
}

const deleteArticle = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  articlesQueries.deleteArticleQuery(id).then(([result]: any) => {
    if (result.affectedRows)
    {
      res.status(200).json({
        message: ServerResponses.REQUEST_OK,
        detail: ServerDetails.DELETE_OK
      })
    } else
    {
      res.status(404).json({
        message: ServerResponses.NOT_FOUND,
        detail: ServerDetails.NO_DATA
      });
    }
  }).catch((error: unknown) => {
    console.error(error);
    res.status(500).json({
      message: ServerResponses.SERVER_ERROR,
      detail: ServerDetails.ERROR_DELETE
    });
  });
}

module.exports = { getAllArticles, getOneArticle, postArticle, postASubategoryForArticle, updateArticle, deleteArticle };