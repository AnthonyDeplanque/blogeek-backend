import { Application, Request, Response } from 'express';
import { ARTICLES_API_ROUTE, CATEGORIES_API_ROUTE, SUBCATEGORIES_API_ROUTE, USERS_API_ROUTE } from '../Blogeek-library/config/apiRoutes';
const usersRouter = require('./routers/users');
const categoriesRouter = require('./routers/categories');
const subcategoriesRouter = require('./routers/subCategories');
const articlesRouter = require('./routers/articles');

const router = (app: Application) => {
  app.use(USERS_API_ROUTE, usersRouter);
  app.use(CATEGORIES_API_ROUTE, categoriesRouter);
  app.use(SUBCATEGORIES_API_ROUTE, subcategoriesRouter);
  app.use(ARTICLES_API_ROUTE, articlesRouter);

  app.get('/', (_req: Request, res: Response) => {
    res.status(200).json({ message: 'Hello World' });
  });
};

// @ts-ignore
const notImplementedFunction = (_req: Request, res: Response) => {
  res.send('this route is not yet implemented');
};

export { router };