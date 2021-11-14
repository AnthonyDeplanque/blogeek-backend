import * as Joi from 'joi';
import * as express from "express";
import { ServerDetails, ServerResponses } from '../Blogeek-library/config/serverResponses';
import { Articles } from '../Blogeek-library/models/Articles';
import { Users } from '../Blogeek-library/models/Users';
import { Comments } from '../Blogeek-library/models/interactions/comments';

const generateId = require("../Blogeek-library/services/idGenerator");
const articlesQueries = require('../SQLqueries/articles');
const articlesMiddlewares = require("../middlewares/articles");
const commentsQueries = require('../SQLqueries/comments');
const usersQueries = require('../SQLqueries/users');

const getAllArticles = async (req: express.Request, res: express.Response) => {
  const { first, last, title, user } = req.params;

  if (first && last && !title && !user)
  {
    articlesQueries.getSelectedArticlesQuery(+first, +last).then(([results]: any[]) => {
      const promises = results.map(async (article: Articles) => {
        article.creator =
          await usersQueries.getOneUserQueryById(article.id_user).then(([[user]]: any) => { return user; })
        article.subcategories = await articlesQueries.getSubcategoriesForArticleQuery(article.id).then(([subcategories]: any) => { return subcategories });
        article.comments = await commentsQueries.getAllCommentsFromAnArticleQuery(article.id).then(([comments]: [Comments][]) => {
          const promiseComments = comments.map(async (comment: Comments) => {
            comment.creator = await usersQueries.getOneUserQueryById(comment.id_user).then(([[user]]: [[any]]) => { return user; })
            return comment;
          })
          return Promise.all([promiseComments]).then((res: any) => res)
        })

        return article;
      })
      Promise.all(promises).then((result: any) => res.status(200).json(result));
    })
      .catch((error: any) => res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }));
  }
  else if (title && !first && !last && !user)
  {
    articlesQueries.getOneArticleByTitleQuery(title).then(([results]: any[]) => {
      const promises = results.map(async (article: Articles) => {
        article.creator =
          await usersQueries.getOneUserQueryById(article.id_user).then(([[user]]: any) => { return user; })
        article.subcategories = await articlesQueries.getSubcategoriesForArticleQuery(article.id).then(([subcategories]: any) => { return subcategories });

        article.comments = await commentsQueries.getAllCommentsFromAnArticleQuery(article.id).then(([comments]: [Comments][]) => {
          const promiseComments = comments.map(async (comment: Comments) => {
            comment.creator = await usersQueries.getOneUserQueryById(comment.id_user).then(([[user]]: [[any]]) => { return user; })
            return comment;
          })
          return Promise.all([promiseComments]).then((res: any) => res)
        })

        return article;
      })
      Promise.all(promises).then((result: any) => res.status(200).json(result));
    })
      .catch((error: any) => res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }));
  }
  else if (user && !first && !last && !title)
  {
    articlesQueries.getAllArticlesFromAnUserQuery(user).then(([results]: any[]) => {
      const promises = results.map(async (article: Articles) => {
        article.creator =
          await usersQueries.getOneUserQueryById(article.id_user).then(([[user]]: any) => { return user; })
        article.subcategories = await articlesQueries.getSubcategoriesForArticleQuery(article.id).then(([subcategories]: any) => { return subcategories });

        article.comments = await commentsQueries.getAllCommentsFromAnArticleQuery(article.id).then(([comments]: [Comments][]) => {
          const promiseComments = comments.map(async (comment: Comments) => {
            comment.creator = await usersQueries.getOneUserQueryById(comment.id_user).then(([[user]]: [[any]]) => { return user; })
            return comment;
          })
          return Promise.all([promiseComments]).then((res: any) => res)
        })

        return article;
      })
      Promise.all(promises).then((result: any) => res.status(200).json(result));
    })
      .catch((error: any) => res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }));
  }
  else if (!user && !first && !last && !title)
  {
    articlesQueries.getArticlesQuery()
      .then(([results]: any[]) => {
        const promises = results.map(async (article: Articles) => {
          article.creator = await usersQueries.getOneUserQueryById(article.id_user).then(([[user]]: any) => { return user; })
          article.subcategories = await articlesQueries.getSubcategoriesForArticleQuery(article.id).then(([subcategories]: any) => subcategories);

          article.comments = await commentsQueries.getAllCommentsFromAnArticleQuery(article.id).then(([comments]: [Comments][]) => {
            const promiseComments = comments.map(async (comment: Comments) => {
              comment.creator = await usersQueries.getOneUserQueryById(comment.id_user).then(([[user]]: [[any]]) => { return user; })
              return comment;
            })
            return Promise.all([promiseComments]).then((res: any) => res)
          })

          return article;
        })
        Promise.all(promises).then((result: any) => res.status(200).json(result));
      })
      .catch((error: any) => res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: error }));
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
  articlesQueries.getOneArticleQuery(id).then(async ([[result]]: [[Articles]]) => {
    const article = result;
    const promise = new Promise(async (resolve, _reject) => {
      article.creator = await usersQueries.getOneUserQueryById(article.id_user).then(([[user]]: [[Users]]) => { return user });
      article.subcategories = await articlesQueries.getSubcategoriesForArticleQuery(article.id).then(([subcategories]: any) => { return subcategories });

      article.comments = await commentsQueries.getAllCommentsFromAnArticleQuery(article.id).then(([comments]: [Comments][]) => {
        const promiseComments = comments.map(async (comment: Comments) => {
          comment.creator = await usersQueries.getOneUserQueryById(comment.id_user).then(([[user]]: [[any]]) => { return user; })
          return comment;
        })
        return Promise.all([promiseComments]).then((res: any) => res)
      })

      resolve(article);
    })
    Promise.resolve(promise).then((result: any) => res.status(200).json(result))
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
      res.status(201).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK, newArticle, result });
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
  articlesQueries.postCategoryForArticleQuery(categoryForArticle).then(([[results]]: any) => {
    res.status(201).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK, categoryForArticle, results });
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
          res.status(204).json({
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
      } else
      {
        res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
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

const deleteArticle = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  articlesQueries.deleteArticleQuery(id).then(async ([result]: any) => {
    if (result.affectedRows)
    {
      const categoriesDeleted = await articlesQueries.deleteCategoryForArticleQuery(id).then(([result]: any) => result.affectedRows);
      const commentsDeleted = await commentsQueries.deleteCommentByArticleQuery(id).then(([result]: any) => result.affectedRows);
      res.status(200).json({
        message: ServerResponses.REQUEST_OK,
        detail: ServerDetails.DELETE_OK,
        categoriesDeleted,
        commentsDeleted
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