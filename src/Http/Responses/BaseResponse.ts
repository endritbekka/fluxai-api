import { Response } from "express";
import {
  BaseError,
  InternalServerError,
  InvalidToken,
  JoiError,
  RouteNotFoundError,
  TokenExpiredError,
} from "../../utils/exceptions/Exceptions";
import { ExpressJoiError } from "express-joi-validation";
import {
  TokenExpiredError as JWTTokenExpiredError,
  JsonWebTokenError,
} from "jsonwebtoken";

class BaseResponse {
  private response: Response;

  constructor(response: Response) {
    this.response = response;
  }

  private handleError(err: unknown) {
    let errOccurred;
    if (err instanceof BaseError) {
      errOccurred = err;
    } else if (err instanceof JWTTokenExpiredError) {
      errOccurred = new TokenExpiredError();
    } else if (err instanceof JsonWebTokenError) {
      errOccurred = new InvalidToken();
    } else if ((err as ExpressJoiError)?.error?.isJoi) {
      errOccurred = new JoiError(err as ExpressJoiError);
    } else {
      errOccurred = new InternalServerError();
    }
    console.log("err:", err);
    return this.response.status(errOccurred.statusCode).json(errOccurred);
  }

  public success(body: object | string | number | boolean | null) {
    this.response.status(200).json({
      error: false,
      message: body,
    });
  }

  public error(err: unknown) {
    this.handleError(err);
  }

  public routeNotFound() {
    this.handleError(new RouteNotFoundError());
  }
}

export default (response: Response) => new BaseResponse(response);
