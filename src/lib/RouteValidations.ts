import * as Joi from "joi";
import { createValidator } from "express-joi-validation";
import Constants from "../utils/Constants";

const organizationCompanyType = Constants.organization.types.COMPANY;

export const RouteValidator = createValidator({ passError: true });
export class RouteValidatorSchema {
  static registerUser() {
    return Joi.object({
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      password: Joi.string().min(6).max(12).required(),
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
    });
  }

  static loginUser() {
    return Joi.object({
      email: Joi.string().email({ minDomainSegments: 2 }).required(),
      password: Joi.string().min(6).max(12).required(),
      tfa_token: Joi.string().allow("").optional(),
    });
  }

  static currentUser() {
    return Joi.object({ access_token: Joi.string().required() });
  }

  static organizationID() {
    return Joi.object({ organization_id: Joi.string().required() });
  }

  static reGenerateAccessToken() {
    return Joi.object({
      access_token: Joi.string().required(),
      refresh_token: Joi.string().required(),
    });
  }

  static verifyUserAccount() {
    return Joi.object({ token: Joi.string().required() });
  }

  static userForgotPassword() {
    return Joi.object({ email: Joi.string().required() });
  }

  static resetPassword() {
    return Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).max(12).required(),
    });
  }

  static deleteEmailTemplate() {
    return Joi.object({ _id: Joi.string().required() });
  }

  static twoFactorAuthSubmit() {
    return Joi.object({
      token: Joi.string().required(),
      code: Joi.number().required(),
    });
  }

  static createEmailTemplate() {
    return Joi.object({
      name: Joi.string().allow("").optional(),
      subject: Joi.string().required(),
      content: Joi.string().required(),
      instructions: Joi.string().allow("").optional(),
    });
  }

  static createOrganization() {
    return Joi.object({
      type: Joi.string()
        .required()
        .valid(
          organizationCompanyType,
          Constants.organization.types.INDIVIDUAL
        ),
      name: Joi.any().when("type", {
        is: organizationCompanyType,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
      phone_number: Joi.any().when("type", {
        is: organizationCompanyType,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
      address: Joi.any().when("type", {
        is: organizationCompanyType,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
      website: Joi.any().when("type", {
        is: organizationCompanyType,
        then: Joi.string().required(),
        otherwise: Joi.optional(),
      }),
    });
  }

  static deleteOrganization() {
    return Joi.object({ id: Joi.string().required() });
  }
}
