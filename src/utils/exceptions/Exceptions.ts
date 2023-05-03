import { ErrorResponse } from "../../lib/types";
import { ExpressJoiError } from "express-joi-validation";

export class BaseError extends Error implements ErrorResponse {
  public error: boolean = true;
  public name: string = "fluxigniter-api-error";
  public message: string = "Server Error";
  public statusCode: number = 400;
  public details: object = {};

  constructor() {
    super();
  }
}

export class InternalServerError extends BaseError {
  name = "internal-server-error";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class RouteNotFoundError extends BaseError {
  name = "route-not-found-error";
  message = "This route could not be found.";
  statusCode = 404;

  constructor() {
    super();
  }
}

export class JoiError extends BaseError {
  name = "joi-error-validation";
  message = "Validation error.";
  statusCode = 400;

  constructor(joiError: ExpressJoiError) {
    super();
    this.details = { validation_errors: joiError.error?.details };
  }
}

export class EmailExistsError extends BaseError {
  name = "user-email-exists-error";
  message = "This email is already in use.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class AuthLoginError extends BaseError {
  name = "auth-login-error";
  message = "Email or password is incorrect.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class InvalidAccessToken extends BaseError {
  name = "auth-access-token-error";
  message = "Invalid access token";
  statusCode = 401;

  constructor() {
    super();
  }
}

export class AccessTokenExpired extends BaseError {
  name = "auth-access-token-expired-error";
  message = "Access token has expired";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class AccessTokenNotExpired extends BaseError {
  name = "auth-access-token-not-expired-error";
  message = "Access token has not been expired.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class InvalidRefreshToken extends BaseError {
  name = "auth-refresh-token-invalid";
  message = "Invalid refresh token.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class RefreshTokenExpired extends BaseError {
  name = "auth-refresh-token-expired";
  message = "Refresh token has expired.";
  statusCode = 401;

  constructor() {
    super();
  }
}

export class UnAuthorizedError extends BaseError {
  name = "un-authorized-error";
  message = "Unauthorized error.";
  statusCode = 401;

  constructor() {
    super();
  }
}

export class UserNotVerifiedError extends BaseError {
  name = "user-not-verified-error";
  message = "User unverified email.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class UserAccountAlreadyVerified extends BaseError {
  name = "user-account-already-verified";
  message = "User account already verified.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class UserDoesNotExistError extends BaseError {
  name = "user-does-not-exist-error";
  message = "User does not exist in out system.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class UserResetPasswordError extends BaseError {
  name = "user-reset-password-error";
  message = "Your new password cannot be the same as your old password.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class UserTwoFactorAuthInvalidCode extends BaseError {
  name = "user-two-factor-auth-invalid-code";
  message = "Invalid code provided.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class TokenExpiredError extends BaseError {
  name = "token-expired-error";
  message = "Token expired.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class InvalidToken extends BaseError {
  name = "invalid-token";
  message = "Invalid token.";
  statusCode = 400;

  constructor() {
    super();
  }
}

export class InvalidOrganization extends BaseError {
  name = "invalid-organization";
  message = "Invalid organization.";
  statusCode = 400;

  constructor() {
    super();
  }
}
