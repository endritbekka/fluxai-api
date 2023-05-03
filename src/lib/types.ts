import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";
import { JwtPayload, Secret, SignOptions } from "jsonwebtoken";
import { EntityData } from "redis-om";

export { ValidatedRequest } from "express-joi-validation";

export type ErrorResponse = {
  error: boolean;
  name: string;
  message: string;
  statusCode: number;
  details: object;
};

export interface User {
  _id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  verified: boolean;
  two_factor_auth_enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  _id: string;
  type: string;
  name: string;
  phone_number: string;
  address: string;
  user: string;
}

export interface EmailTemplate {
  _id: string;
  name?: string;
  subject: string;
  content: string;
  instructions?: string;
  organization: string | Organization;
}
export interface RegisterUser
  extends Pick<User, "first_name" | "last_name" | "password" | "email"> {}

export interface RegisterUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: RegisterUser;
}

export interface UserLogin extends Pick<User, "email" | "password"> {
  tfa_token?: string;
}

export interface UserLoginRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UserLogin;
}

export interface UserVerifyAccountRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    token: string;
  };
}

export interface UserForgotPasswordRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    email: string;
  };
}

export interface UserResetPasswordRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    token: string;
    password: string;
  };
}

export interface UserTwoFactorAuthSubmit {
  token: string;
  code: number;
}

export interface UserTwoFactorAuthSubmitRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: UserTwoFactorAuthSubmit;
}

export interface UserSession {
  entityId: string;
  user_id: string;
  access_token: string;
  refresh_token: string;
  access_token_exp: number;
  refresh_token_exp: number;
}
export interface CreateUserSession
  extends EntityData,
    Omit<UserSession, "entityId"> {}

export interface CreateOrganization {
  type: string;
  name: string | null;
  phone_number: string | null;
  address: string | null;
  user: string;
}

export interface CreateOrganizationRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: CreateOrganization;
}

export interface CreateEmailTemplate {
  name?: string;
  subject: string;
  content: string;
  instructions?: string;
  organization: string;
}
export interface CreateEmailTemplateRequest extends ValidatedRequestSchema {
  [ContainerTypes.Body]: CreateEmailTemplate;
}

export interface DeleteEmailTemplate {
  _id: string;
}

export interface DeleteEmailTemplateRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: DeleteEmailTemplate;
}

export interface DeleteOrganization {
  id: string;
}

export interface DeleteOrganizationRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: DeleteOrganization;
}

declare global {
  namespace Express {
    export interface Request {
      user: User;
      session: UserSession;
      organization: Organization;
    }
  }
}

export interface JWTSign {
  payload: string | Buffer | object;
  secretOrPrivateKey: Secret;
  options?: SignOptions | undefined;
}

export interface JWTVerify {
  token: string;
  secretOrPrivateKey: Secret;
}

export interface SendEmail {
  email: string;
  subject: string;
  template: string;
}

export type CatchExceptionCallback<T> = (...args: any[]) => T | Promise<T>;

export interface UserVerifyAccountJWTPayload extends JwtPayload {
  user_id: string;
}

export interface UserResetPasswordJWTPayload extends JwtPayload {
  user_id: string;
}

export interface UserTwoFactorSavedTokenJWTPayload extends JwtPayload {
  user_id: string;
}

export interface UserTwoFactorAuthJWTPayload extends JwtPayload {
  user_id: string;
  code: number;
}
