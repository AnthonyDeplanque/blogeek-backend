import * as Joi from 'joi';
import * as express from "express";
import { Categories, SubCategories } from '../../Blogeek-library/models/Categories';
import { ServerDetails, ServerResponses } from '../config/serverResponses';

const generateId = require("../../Blogeek-library/services/idGenerator");
const categoriesMiddlewares = require('../middlewares/categories');
const categoriesQueries = require('../SQLqueries/categories');

const getCategories = (_req: express.Request, res: express.Response) => {
  categoriesQueries.getCategoriesQuery().then(([results]: any[]) => {
    const categories = results.map(async (cat: Categories) => {
      const subCat = await categoriesQueries.getSubCategoriesFromIdCategoryQuery(cat.id).then(([results]: any[]) => {
        const subCategories: string[] = results.map((sub: SubCategories) => sub.title);
        return subCategories;
      })
      cat.sub_categories = subCat;
      return cat;
    })
    Promise.all(categories).then((result) => {
      res.status(200).json(result);
    }
    )
  })
    .catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING });
    })
}

const getOneCategory = (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  const promise = categoriesQueries.getOneCategoryQuery(id).then(async ([[result]]: [[Categories]]) => {
    const category: Categories = result;
    await categoriesQueries.getSubCategoriesFromIdCategoryQuery(id).then(([results]: any) => {
      const subCategories: string[] = results.map((sub: SubCategories) => sub.title);
      return subCategories;
    }).then((results: SubCategories[]) => { category.sub_categories = results })
    return category;
  })
  Promise.resolve(promise)
    .then((value: any) => res.status(200).json(value))
    .catch((error: unknown) => {
      console.error(error)
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
    })
}

const getSubCategories = (_req: express.Request, res: express.Response) => {
  categoriesQueries.getSubCategoriesQuery().then(([results]: any) => {
    res.status(200).json(results);
  })
    .catch((error: unknown) => {
      console.error(error);
      res.status(500).json({
        message: ServerResponses.SERVER_ERROR,
        detail: ServerDetails.ERROR_RETRIEVING
      })
    })
}

const getOneSubCategory = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  categoriesQueries.getOneSubCategoryQuery(id).then(([results]: any) => {
    if (results.length)
    {
      res.status(200).json(results[0]);
    }
    else res.status(404).json({
      message: ServerResponses.NOT_FOUND,
      deteil: ServerDetails.NO_DATA
    })
  })
    .catch((error: unknown) => {
      console.error(error);
      res.status(500).json({
        message: ServerResponses.SERVER_ERROR,
        detail: ServerDetails.ERROR_RETRIEVING
      })
    })
}

const postCategory = (req: express.Request, res: express.Response) => {
  const { title } = req.body;
  const id = generateId();
  const { error } = Joi.object(categoriesMiddlewares.postCategoryValidationObject).validate({ id, title }, { abortEarly: false });
  if (error)
  {
    console.error(error);
    res.status(422).json({ validationError: error.details });
  } else
  {
    categoriesQueries.getOneCategoryByTitle(title).then(([result]: any[]) => {
      if (result.length)
      {
        res.status(409).json({ message: ServerResponses.CONFLICT, detail: ServerDetails.ALREADY_EXIST });
      } else
      {
        categoriesQueries.postOneCategoryQuery({ id, title }).then(([result]: any) => {
          res.status(201).json({ ...result, response: { message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK } })
        }).catch((error: unknown) => {
          console.error(error);
          res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
        });
      }

    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
    })

  }
}

const postSubCategory = (req: express.Request, res: express.Response) => {
  const { title, id_category } = req.body;
  const id = generateId();
  const { error } = Joi.object(categoriesMiddlewares.postSubCategoryValidationObject).validate({ id, id_category, title }, { abortEarly: false });
  if (error)
  {
    console.error(error);
    res.status(422).json({ validationError: error.details });
  } else
  {
    categoriesQueries.getOneSubCategoryByTitle(title).then(([result]: any[]) => {
      if (result.length)
      {
        res.status(409).json({ message: ServerResponses.CONFLICT, detail: ServerDetails.ALREADY_EXIST });
      } else
      {
        categoriesQueries.postOneSubCategoryQuery({ id, id_category, title }).then(([result]: any) => {
          res.status(201).json({ ...result, response: { message: ServerResponses.REQUEST_OK, detail: ServerDetails.CREATION_OK } })
        }).catch((error: unknown) => {
          console.error(error);
          res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
        });
      }

    }).catch((error: unknown) => {
      console.error(error);
      res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
    })

  }
}

const updateCategory = (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  const { error } = Joi.object(categoriesMiddlewares.updateCategoryValidationObject).validate(req.body, { abortEarly: false });
  if (error)
  {
    console.error(error)
    res.status(422).json({ validationError: error.details })
  } else
  {
    categoriesQueries.getOneCategoryQuery(id).then(([[result]]: any) => {
      if (result)
      {
        categoriesQueries.updateOneCategoryQuery(id, req.body).then(([result]: any) => {
          res.status(200).json({ result: { ...result }, message: ServerResponses.REQUEST_OK, detail: ServerDetails.UPDATE_OK });
        }).catch((error: unknown) => {
          console.error(error);
          res.status(500).json({
            message: ServerResponses.SERVER_ERROR,
            detail: ServerDetails.ERROR_UPDATE
          })
        })
      } else
      {
        res.status(404).json({
          message: ServerResponses.NOT_FOUND,
          detail: ServerDetails.NO_DATA
        })
      }
    })
  }

}

const updateSubCategory = (req: express.Request, res: express.Response) => {
  const { id } = req.params;

  const { error } = Joi.object(categoriesMiddlewares.updateSubCategoryValidationObject).validate(req.body, { abortEarly: false });
  if (error)
  {
    console.error(error)
    res.status(422).json({ validationError: error.details })
  } else
  {
    categoriesQueries.getOneSubCategoryQuery(id).then(([[result]]: any) => {
      if (result)
      {
        categoriesQueries.updateOneSubCategoryQuery(id, req.body).then(([result]: any) => {
          res.status(200).json({ result: { ...result }, message: ServerResponses.REQUEST_OK, detail: ServerDetails.UPDATE_OK });
        }).catch((error: unknown) => {
          console.error(error);
          res.status(500).json({
            message: ServerResponses.SERVER_ERROR,
            detail: ServerDetails.ERROR_UPDATE
          })
        })
      } else
      {
        res.status(404).json({
          message: ServerResponses.NOT_FOUND,
          detail: ServerDetails.NO_DATA
        })
      }
    })
  }

}

const deleteCategory = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  let subCatDeleted: number;
  await categoriesQueries.deleteCategoryQuery(id).then(([result]: any) => {
    if (result.affectedRows)
    {
      let articlesDeleted = 0;
      let idSubCat = categoriesQueries
        .getSubCategoriesFromIdCategoryQuery(id).then(([results]: any) => {
          return results.map((subcat: SubCategories) => subcat.id);
        })
      categoriesQueries.deleteSubCategoriesFromIdCategoryQuery(id).then(([result]: any) => {
        if (result.affectedRows)
        {
          subCatDeleted = result.affectedRows;
          Promise.resolve(idSubCat).then((values: any) => values.map((idsub: string) => {
            categoriesQueries.deleteCategoryForArticleQuery(idsub).then(([result]: any) => {
              if (result.affectedRows)
              {
                ++articlesDeleted;
              }
            }).catch((error: unknown) => {
              console.error(error);
              res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
            })
          }))
        }
      }).catch((error: unknown) => { console.error(error); res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING }) })
      res.status(202).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.DELETE_OK, categories_deleted: result.affectedRows, subcategories_deleted: subCatDeleted, articles_deleted: articlesDeleted })
    } else
    {
      res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
    }
  }).catch((error: unknown) => {
    console.error(error); res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
  })
}

const deleteSubCategory = async (req: express.Request, res: express.Response) => {
  const { id } = req.params;
  await categoriesQueries.deleteSubCategoryQuery(id).then(async ([result]: any) => {
    let articles_deleted = 0;
    let subcategories_deleted = result.affectedRows | 0;
    if (result.affectedRows !== 0)
    {
      await categoriesQueries.deleteCategoryForArticleQuery(id).then(([results]: any) => {
        if (results.affectedRows !== 0)
        {
          articles_deleted = results.affectedRows;
          articles_deleted;
          res.status(202).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.DELETE_OK, subcategories_deleted });
        } else
        {
          res.status(202).json({ message: ServerResponses.REQUEST_OK, detail: ServerDetails.DELETE_OK, subcategories_deleted });
        }
      }).catch((error: unknown) => { console.error(error); res.status(500).send(error) })
    }
    else
    {
      res.status(404).json({ message: ServerResponses.NOT_FOUND, detail: ServerDetails.NO_DATA });
    }
  }).catch((error: unknown) => {
    console.error(error);
    res.status(500).json({ message: ServerResponses.SERVER_ERROR, detail: ServerDetails.ERROR_RETRIEVING })
  })
}

module.exports = { getCategories, getOneCategory, getSubCategories, getOneSubCategory, postCategory, updateCategory, deleteCategory, postSubCategory, updateSubCategory, deleteSubCategory };

