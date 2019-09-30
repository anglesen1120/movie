import { NextFunction, Request, Response, Router } from "express";
import { getManager } from "typeorm";
import {
  check,
  query,
  body,
  validationResult,
  oneOf
} from "express-validator/check";
import * as HttpStatus from "http-status-codes";

// Import Config
import config from "../config/config";
const { errors } = config;

// Import Interfaces
import { IApiResponseError } from "../resources/interfaces/IApiResponseError";
import { IApiResponseSuccess } from "../resources/interfaces/IApiResponseSuccess";

// Import Services
import { CommentsService } from "../services/comments.service";
import { MoviesService } from "../services/movies.service";

// Import Entities
import { Comment } from "../entities/Comment";
import { Movie } from "../entities/Movie";

const commentsRouter: Router = Router();

commentsRouter
  .route("/")

  .get(
    [
      query("offset")
        .optional()
        .isInt(),

      query("limit")
        .optional()
        .isInt()
    ],

    async (req: Request, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const error: IApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorsArray: validationErrors.array()
        };
        return next(error);
      }

      const commentsService = new CommentsService();
      const offset: number = parseInt(req.query.offset, 10) || 0;
      const limit: number = parseInt(req.query.limit, 10) || 12;

      try {
        const comments: Comment[] = await commentsService.getAll(limit, offset);
        const response: IApiResponseSuccess = {
          success: true,
          data: comments
        };

        return res.status(HttpStatus.OK).json(response);
      } catch (err) {
        const error: IApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: err
        };
        next(error);
      }
    }
  )

  .post(
    [
      oneOf([
        body("movieId")
          .isLength({ min: 1 })
          .isInt(),
        body("content").isLength({ min: 1 }),
        body().isArray()
      ]),
      check("movieId").exists(),
      check("content").exists()
    ],

    async (req: Request, res: Response, next: NextFunction) => {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        const error: IApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorsArray: validationErrors.array()
        };
        return next(error);
      }

      const commentsService = new CommentsService();
      const moviesService = new MoviesService();

      // if you set several objects in array, it will work too
      if (req.body instanceof Array) {
        for (var key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            let item = req.body[key];
            let movieId: string | number = item.movieId;
            let movie: Movie = await moviesService.getById(movieId);

            if (!movie) continue;

            let commentTransform: any = await commentsService.renameJson(item);
            await commentsService.instantiate(commentTransform);

            try {
              await commentsService.insert(commentTransform);
            } catch (err) {
              const error: IApiResponseError = {
                code: HttpStatus.BAD_REQUEST,
                errorObj: err
              };
              next(error);
            }
          }
        }

        const response: IApiResponseSuccess = {
          success: true
        };

        return res.status(HttpStatus.OK).json(response);
      }

      const movieId: string | number = req.body.movieId;
      const movie: Movie = await moviesService.getById(movieId);

      if (!movie) {
        const response: IApiResponseError = {
          success: false,
          message: `${errors.movieNotFound}`
        };

        return res.status(HttpStatus.BAD_REQUEST).json(response);
      }

      const commentTransform: any = await commentsService.renameJson(req.body);
      await commentsService.instantiate(commentTransform);

      try {
        await commentsService.insert(commentTransform);
        const response: IApiResponseSuccess = {
          success: true,
          data: commentTransform
        };

        return res.status(HttpStatus.OK).json(response);
      } catch (err) {
        const error: IApiResponseError = {
          code: HttpStatus.BAD_REQUEST,
          errorObj: err
        };
        next(error);
      }
    }
  );

export default commentsRouter;
