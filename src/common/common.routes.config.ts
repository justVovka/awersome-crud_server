import express = require("express");

abstract class CommonRoutesConfig {
  app: express.Application;
  name: string;

  protected constructor(app: express.Application, name: string) {
    this.app = app;
    this.name = name;
    this.configureRoutes();
  }

  getName() {
    return this.name;
  }

  abstract configureRoutes(): Promise<express.Application>;
}

export default CommonRoutesConfig;
