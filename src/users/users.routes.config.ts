import express from "express";
import CommonRoutesConfig from '../common/common.routes.config';
import {db_config} from "../config/db.config";
import UserRepository from "./user.repository";

const pgp = require('pg-promise')();
const db = pgp(db_config);

class UsersRoutes extends CommonRoutesConfig {
  private readonly userRepository:UserRepository = new UserRepository(db);

  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }

  async configureRoutes(): Promise<express.Application> {
    await this.app.route(`/users`)
      .get((req: express.Request, res: express.Response) => {
        this.userRepository.all()
          .then(data => {
            return res.json(data)
          });
      })
      .post((req:express.Request, res:express.Response) => {
        res.status(200).send('Post users');
      });

    this.app.route(`/users/:userId`)
      .all((req: express.Request, res: express.Response, next: express.NextFunction) => {
        next();
      })
      .get((req: express.Request, res: express.Response) => {
        res.status(200).send(`GET requested for id ${req.params.userId}`);
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT requested for id ${req.params.userId}`);
      })
      .patch((req: express.Request, res: express.Response) => {
        res.status(200).send(`PATCH requested for id ${req.params.userId}`);
      })
      .delete((req: express.Request, res: express.Response) => {
        res.status(200).send(`DELETE requested for id ${req.params.userId}`);
      });
    return this.app;
  }
}

export default UsersRoutes;
