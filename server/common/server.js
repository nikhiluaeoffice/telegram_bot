import express from "express";
import Mongoose from "mongoose";
import Config from "config";
import * as http from "http";
import * as path from "path";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import apiErrorHandler from '../helper/apiErrorHandler';
import { config } from "dotenv";
const app = new express();
var server = http.createServer(app);
const root = path.normalize(`${__dirname}/../..`);
const serverless = require("serverless-http");

//***************************** Import Functions ************************/
import bot from '../api/v1/controllers/bot/controller';

//***********************************************************************/



class ExpressServer {
  constructor() {
    app.use(express.json({ limit: '1000mb' }));

    app.use(express.urlencoded({ extended: false, limit: '1000mb' }));

    app.use(morgan('dev'));

    app.use(
      cors({
        allowedHeaders: ["Content-Type", "token", "authorization"],
        exposedHeaders: ["token", "authorization"],
        origin: "*",
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
      })
    );

    // app.use("/.netlify/functions/app", );
  }
  router(routes) {
    routes(app);
    return this;
  }



  configureSwagger(swaggerDefinition) {
    const options = {
      // swaggerOptions : { authAction :{JWT :{name:"JWT", schema :{ type:"apiKey", in:"header", name:"Authorization", description:""}, value:"Bearer <JWT>"}}},
      swaggerDefinition,
      apis: [
        path.resolve(`${root}/server/api/v1/controllers/**/*.js`),
        path.resolve(`${root}/api.yml`),
      ],
    };

    app.use(
      "/api-docs",
      // basicAuth({
      // users: { "no-aashutosh": "Mobiloitte1" },
      //   challenge: true,
      // }),
      swaggerUi.serve,
      swaggerUi.setup(swaggerJSDoc(options))
    );
    return this;
  }

  handleError() {
    app.use(apiErrorHandler);

    return this;
  }

  configureDb(dbUrl) {
    return new Promise((resolve, reject) => {
      Mongoose.connect(dbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }, (err) => {
        if (err) {
          console.log(`Error in mongodb connection ${err.message}`);
          return reject(err);
        }
        console.log("Mongodb connection established");
        return resolve(this);
      });
    });
  }


  listen(port) {
    server.listen(port, () => {
      console.log(`secure app is listening @port ${port}`, new Date().toLocaleString());
    });
    return app;
  }
}


export default ExpressServer;

module.exports.handler = serverless(app);

function originIsAllowed(origin) {
  return true;
}


