import "mocha";

import chai from "chai";
import chaiHttp = require("chai-http");

chai.use(chaiHttp);
const should = chai.should();
import { app } from "./helpers/tests-helper";
import config from "../config/config";
const { errors } = config;

const commentToCreate = {
  movieId: "1",
  content: "lorem ipsum"
};

describe("Comments", () => {
  describe("GET /comments", () => {
    it("should be able to return comments's data", done => {
      chai
        .request(app)
        .get("/comments")
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

  describe("POST /comments", () => {
    it("should be able to return create new comment", async () => {
      const res = await chai
        .request(app)
        .post("/comments")
        .send(commentToCreate);

      res.should.have.status(200);
      res.body.should.be.a("object");
      res.body.should.have.property("success");
      res.body.success.should.equal(true);
    });

    it("should not be able to comment on a movie that does not exist", async () => {
      const tmpComment = Object.assign({}, commentToCreate);
      tmpComment.movieId = "999";

      const res = await chai
        .request(app)
        .post("/comments")
        .send(tmpComment);

      res.should.have.status(400);
      res.body.should.be.a("object");
      res.body.should.have.property("success");
      res.body.success.should.equal(false);
      res.body.should.have.property("message");
      res.body.message.trim().should.equal(errors.movieNotFound);
    });

    it("should not be able to return comments without a content field in body", async () => {
      const tmpComment = Object.assign({}, commentToCreate);
      delete tmpComment.content;

      chai
        .request(app)
        .post("/comments")
        .send(tmpComment)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.equal(false);
        });
    });

    it("should not be able to return comments without a movieId field in body", async () => {
      const tmpComment = Object.assign({}, commentToCreate);
      delete tmpComment.movieId;

      chai
        .request(app)
        .post("/comments")
        .send(tmpComment)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.success.should.equal(false);
        });
    });
  });
});
