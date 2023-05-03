import { Router, Response, Request } from "express";
import UserController from "../Controllers/UserController";
import BaseResponse from "../Responses/BaseResponse";
import {
  RouteValidator,
  RouteValidatorSchema,
} from "../../lib/RouteValidations";
import {
  CreateOrganizationRequest,
  DeleteOrganizationRequest,
  ValidatedRequest,
} from "../../lib/types";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import OrganizationController from "../Controllers/OrganizationController";

const router = Router();

router.post(
  "/create",
  RouteValidator.headers(RouteValidatorSchema.currentUser()),
  RouteValidator.body(RouteValidatorSchema.createOrganization()),
  [
    AuthMiddleware.validateAccessToken,
    AuthMiddleware.validateAccessTokenExpiration,
  ],
  async (
    request: ValidatedRequest<CreateOrganizationRequest>,
    response: Response
  ) => {
    BaseResponse(response).success(
      await OrganizationController.create(request)
    );
  }
);

router.post(
  "/delete",
  RouteValidator.headers(RouteValidatorSchema.currentUser()),
  RouteValidator.query(RouteValidatorSchema.deleteOrganization()),
  [
    AuthMiddleware.validateAccessToken,
    AuthMiddleware.validateAccessTokenExpiration,
  ],
  async (
    request: ValidatedRequest<DeleteOrganizationRequest>,
    response: Response
  ) => {
    BaseResponse(response).success(
      await OrganizationController.delete(request)
    );
  }
);

router.get(
  "/list",
  RouteValidator.headers(RouteValidatorSchema.currentUser()),
  [
    AuthMiddleware.validateAccessToken,
    AuthMiddleware.validateAccessTokenExpiration,
  ],
  async (request: Request, response: Response) => {
    BaseResponse(response).success(await OrganizationController.list(request));
  }
);

export default router;
