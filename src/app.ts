import express from "express";
import * as http from 'http';
import * as path from "path";
import cors from "cors";
require('dotenv').config();
import * as expressWinston from 'express-winston';
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

import UsersRoutes from './users/users.routes.config';
import CommonRoutesConfig from './common/common.routes.config';
import {debugLog, loggerOptions} from "./middleware/log";

const app:express.Application = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(expressWinston.logger(loggerOptions));

const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/apidocs.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const server:http.Server = http.createServer(app);
const port = process.env.SERVER_PORT;

const routes:Array<CommonRoutesConfig> = [];
routes.push(new UsersRoutes(app));

app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage)
});

const runningMessage = `Server running at http://localhost:${port}`;

server.listen(port, () => {
  routes.forEach((route: CommonRoutesConfig) => {
    debugLog(`Routes configured for ${route.getName()}`);
  });
  console.log(runningMessage);
});
