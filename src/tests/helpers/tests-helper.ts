import { Application } from "../../app";
import express from "express";
import chai from "chai";
import chaiHttp = require("chai-http");
import { before } from "mocha";
import "mocha";

chai.use(chaiHttp);
const should = chai.should();

let application: Application;
export let app: express.Application;

before(async () => {
  application = await new Application();
  await application.setupDbAndServer();
  app = application.app;

  await chai
    .request(app)
    .post("/movies")
    .send({ title: "Batman" });

  console.info("## Starting tests...");
});
