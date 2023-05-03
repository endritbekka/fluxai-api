import { Router, Response, Request } from "express";
import BaseResponse from "../Responses/BaseResponse";
import {
  RouteValidator,
  RouteValidatorSchema,
} from "../../lib/RouteValidations";
import {
  CreateEmailTemplateRequest,
  DeleteEmailTemplateRequest,
  ValidatedRequest,
} from "../../lib/types";
import AuthMiddleware from "../Middlewares/AuthMiddleware";
import EmailTemplateController from "../Controllers/EmailTemplateController";

const router = Router();

router.get(
  "/list",
  RouteValidator.headers(RouteValidatorSchema.currentUser()),
  RouteValidator.headers(RouteValidatorSchema.organizationID()),
  [
    AuthMiddleware.validateAccessToken,
    AuthMiddleware.validateAccessTokenExpiration,
    AuthMiddleware.validateOrganization,
  ],
  async (request: Request, response: Response) => {
    BaseResponse(response).success(await EmailTemplateController.list(request));
  }
);

router.post(
  "/create",
  RouteValidator.headers(RouteValidatorSchema.currentUser()),
  RouteValidator.headers(RouteValidatorSchema.organizationID()),
  RouteValidator.body(RouteValidatorSchema.createEmailTemplate()),
  [
    AuthMiddleware.validateAccessToken,
    AuthMiddleware.validateAccessTokenExpiration,
    AuthMiddleware.validateOrganization,
  ],
  async (
    request: ValidatedRequest<CreateEmailTemplateRequest>,
    response: Response
  ) => {
    BaseResponse(response).success(
      await EmailTemplateController.create(request)
    );
  }
);

router.post(
  "/delete",
  RouteValidator.headers(RouteValidatorSchema.currentUser()),
  RouteValidator.headers(RouteValidatorSchema.organizationID()),
  RouteValidator.query(RouteValidatorSchema.deleteEmailTemplate()),
  [
    AuthMiddleware.validateAccessToken,
    AuthMiddleware.validateAccessTokenExpiration,
    AuthMiddleware.validateOrganization,
  ],
  async (
    request: ValidatedRequest<DeleteEmailTemplateRequest>,
    response: Response
  ) => {
    BaseResponse(response).success(
      await EmailTemplateController.delete(request)
    );
  }
);

export default router;
