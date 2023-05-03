import { NextFunction, Request, Response } from "express";
import { UserSession } from "../../lib/types";
import UserService from "../../services/UserService";
import {
  AccessTokenExpired,
  InvalidAccessToken,
  InvalidOrganization,
  UnAuthorizedError,
} from "../../utils/exceptions/Exceptions";
import OrganizationService from "../../services/OrganizationService";

class AuthMiddleware {
  private userService: UserService;
  private organizationService: OrganizationService;

  constructor() {
    this.userService = new UserService();
    this.organizationService = new OrganizationService();
  }

  public validateAccessToken = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const access_token = request.headers.access_token as string;
    const result = await this.userService.findSession(
      "access_token",
      access_token
    );
    if (!result) {
      throw new InvalidAccessToken();
    }
    const session: UserSession = this.userService.toRedisJson(
      result
    ) as unknown as UserSession;

    request.session = session;
    next();
  };

  public validateAccessTokenExpiration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    if (this.userService.tokenExpired(request.session.access_token_exp)) {
      throw new AccessTokenExpired();
    }
    next();
  };

  public populateUser = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const user = await this.userService.findById(request.session.user_id);
    if (!user) {
      throw new UnAuthorizedError();
    }
    request.user = user;
    next();
  };

  public validateOrganization = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = request.headers["organization_id"] as string;
    const organization = await this.organizationService.findOne({
      user: request.session.user_id,
      _id: id,
    });
    if (!organization) {
      throw new InvalidOrganization();
    }
    request.organization = organization;
    next();
  };
}

export default new AuthMiddleware();
