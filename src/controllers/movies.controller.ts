import { NextFunction, Request, Response, Router } from "express";
import {
  query,
  check,
  body,
  validationResult,
  oneOf
} from "express-validator/check";
import * as HttpStatus from "http-status-codes";

// Import Config
import config from "../config/config";
const { errors } = config;

// Import Services
import { OMBDService } from "../services/omdb.service";
import { MoviesService } from "../services/movies.service";

// Import Interfaces
import { IApiResponseError } from "../resources/interfaces/IApiResponseError";
import { IApiResponseSuccess } from "../resources/interfaces/IApiResponseSuccess";

// Import Entities
import { Movie } from "../entities/Movie";

const moviesRouter: Router = Router();

moviesRouter
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
      const moviesService = new MoviesService();

      const offset: number = parseInt(req.query.offset, 10) || 0;
      const limit: number = parseInt(req.query.limit, 10) || 12;

      try {
        const movies: any[] = await moviesService.getAll(limit, offset);
        const transformGridData: any[] = movies.map(({ ...item }) => ({
          ...item,
          movie_ratings: JSON.parse(item.movie_ratings)
        }));
        const response: IApiResponseSuccess = {
          success: true,
          data: transformGridData
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
        body("title")
          .isLength({ min: 1 })
          .isString(),
        body().isArray()
      ]),
      check("title").exists()
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

      const ombdService = new OMBDService();
      const moviesService = new MoviesService();

      // if you set several objects in array, it will work too
      if (req.body instanceof Array) {
        for (var key in req.body) {
          if (req.body.hasOwnProperty(key)) {
            let item = req.body[key];
            let title: string = item.title;
            let ombd: any = await ombdService.getByTitle(title);
            let isMovie: Movie | undefined = await moviesService.getByTitle(
              ombd.data.Title
            );

            if (isMovie || ombd.data.Response === "False") continue;

            let ombdTransform = ombdService.renameJson(ombd.data);
            await moviesService.instantiate(ombdTransform);

            try {
              await moviesService.insert(ombdTransform);
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

      const title: string = req.body.title;
      const ombd: any = await ombdService.getByTitle(title);
      const isMovie: Movie | undefined = await moviesService.getByTitle(
        ombd.data.Title
      );

      if (isMovie || ombd.data.Response === "False") {
        const response: IApiResponseError = {
          success: false,
          message: isMovie ? `${errors.movieExist}` : `${errors.titleNotFound}`
        };

        return res.status(HttpStatus.BAD_REQUEST).json(response);
      }

      const ombdTransform = ombdService.renameJson(ombd.data);
      await moviesService.instantiate(ombdTransform);

      try {
        await moviesService.insert(ombdTransform);
        const response: IApiResponseSuccess = {
          success: true,
          data: ombdTransform
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

export default moviesRouter;
