import "reflect-metadata";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import helmet from "helmet";
import morgan from "morgan";
import { createConnection } from "typeorm";

import config from "./config/config";
import genericErrorHandler from "./middlewares/genericErrorHandler";
import nodeErrorHandler from "./middlewares/nodeErrorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";
import routes from "./routes";
import * as swaggerDocument from "./utils/swagger/swagger.json";
import { Logger, ILogger } from "./utils/logger";

export class Application {
  public app: express.Application;
  private _config = config;
  private _logger: ILogger;

  constructor() {
    this._logger = new Logger(__filename);
    this.app = express();

    this.app.use(require("express-status-monitor")());
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(
      morgan("dev", {
        skip: () => process.env.NODE_ENV === "test"
      })
    );
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

    this.app.use("/", routes);
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );
    this.app.use(genericErrorHandler);
    this.app.use(notFoundHandler);
  }

  public setupDbAndServer = async () => {
    const conn = await createConnection();
    this._logger.info(
      `Connected to database. Connection: ${conn.name} / ${conn.options.database}`
    );
    await this.startServer();
  };

  private startServer = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      this.app
        .listen(+this._config.port, this._config.host, () => {
          this._logger.info(
            `Server started at http://${this._config.host}:${this._config.port}`
          );
          resolve(true);
        })
        .on("error", nodeErrorHandler);
    });
  };
}
