import "mocha";

import chai from "chai";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);
const should = chai.should();
import { app } from "./helpers/tests-helper";
import config from "../config/config";
const { errors } = config;

const moviesToCreate = {
  title: "Spiderman"
};

describe("Movies", () => {
  describe("GET /movies", () => {
    it("should be able to return movies's data", done => {
      chai
        .request(app)
        .get("/movies")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("success");
          res.body.should.have.property("data");
          res.body.success.should.equal(true);
          res.body.success.should.be.a("boolean");
          res.body.data.should.be.a("array");
          done();
        });
    });
  });

  describe("POST /movies", () => {
    it("should be able to return create movie", async () => {
      const response = await chai
        .request(app)
        .post("/movies")
        .send(moviesToCreate);

      response.should.have.status(200);
    });

    it("should not be able to return movies without a title field in body", async () => {
      const tmpMovie = Object.assign({}, moviesToCreate);
      delete tmpMovie.title;

      chai
        .request(app)
        .post("/movies")
        .send(tmpMovie)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.equal(false);
        });
    });

    it("should not be able to return create movie that exist in mysql database", async () => {
      const tmpMovie = Object.assign({}, moviesToCreate);
      tmpMovie.title = "Batman";

      const res = await chai
        .request(app)
        .post("/movies")
        .send(tmpMovie);

      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property("success");
      res.body.success.should.equal(false);
      res.body.should.have.property("message");
      res.body.message.trim().should.equal(errors.movieExist);
    });
  });
});
