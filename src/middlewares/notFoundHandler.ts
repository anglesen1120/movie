import * as HttpStatus from "http-status-codes";
import { Request, Response, NextFunction } from "express";
import { IApiResponseError } from "../resources/interfaces/IApiResponseError";

/**
 * Error response middleware for 404 not found.
 *
 * @param  {Request} req
 * @param  {Response} res
 * @param  {NextFunction} next
 * @returns <void>
 */
export default function notFoundError(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const response: IApiResponseError = {
    error: {
      code: HttpStatus.NOT_FOUND,
      message: HttpStatus.getStatusText(HttpStatus.NOT_FOUND)
    }
  };

  res.status(HttpStatus.NOT_FOUND).json(response);
}
