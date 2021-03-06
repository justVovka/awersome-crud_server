import express from "express";
import CommonRoutesConfig from '../common/common.routes.config';
import {db_config} from "../config/db.config";
import UserRepository from "./user.repository";
import {HttpStatuses} from "../constants/HttpStatuses";
import {
  NOT_FOUND_MESSAGE,
  SUCCESS_CREATED_MESSAGE,
  SUCCESS_DELETED_MESSAGE,
  SUCCESS_UPDATED_MESSAGE
} from "../constants/HttpStatusMessages";

const pgp = require('pg-promise')();
const db = pgp(db_config);

class UsersRoutes extends CommonRoutesConfig {
  private readonly userRepository:UserRepository = new UserRepository(db);

  constructor(app: express.Application) {
    super(app, 'UserRoutes');
  }

  async configureRoutes(): Promise<express.Application> {
    await this.app.route(`/api/v1/users`)
      .get((req: express.Request, res: express.Response) => {
        this.userRepository.all()
          .then(data => res.json(data));
      })
      .post((req: express.Request, res: express.Response) => {
        const {id, name, surname, birthdate, profession} = req.body;
        this.userRepository.add(id, name, surname, birthdate, profession)
          .then(() => {
            res.status(HttpStatuses.Created);
            res.json({
              code: HttpStatuses.Created,
              message: SUCCESS_CREATED_MESSAGE
            })
          })
          .catch(error => {
            res.status(HttpStatuses.BadRequest);
            res.json({
              code: HttpStatuses.BadRequest,
              message: error.message
            });
          })
      });

    await this.app.route(`/api/v1/users/:userId`)
      .get((req: express.Request, res: express.Response) => {
        this.userRepository.findById(req.params.userId)
          .then(data => res.json(data))
          .catch(() => {
            res.status(HttpStatuses.NotFount)
            res.json({
              code: HttpStatuses.NotFount,
              message: NOT_FOUND_MESSAGE
            })
          });
      })
      .put((req: express.Request, res: express.Response) => {
        res.status(200).send(`PUT requested for id ${req.params.userId}`);
      })
      .patch((req: express.Request, res: express.Response) => {
        this.userRepository.update(req.body, req.params.userId)
          .then(() => {
            res.status(HttpStatuses.Ok);
            res.json({
              code: HttpStatuses.Ok,
              message: SUCCESS_UPDATED_MESSAGE
            });
          })
          .catch((error) => {
            res.status(HttpStatuses.NotFount)
            res.json({
              code: HttpStatuses.NotFount,
              message: NOT_FOUND_MESSAGE
            })
          });
      })
      .delete((req: express.Request, res: express.Response) => {
        this.userRepository.remove(req.params.userId)
          .then(() => {
            res.status(HttpStatuses.Ok);
            res.json({
              code: HttpStatuses.Ok,
              message: SUCCESS_DELETED_MESSAGE
            })
          })
          .catch(() => {
            res.status(HttpStatuses.NotFount)
            res.json({
              code: HttpStatuses.NotFount,
              message: NOT_FOUND_MESSAGE
            })
          });
      });
    return this.app;
  }
}

export default UsersRoutes;
