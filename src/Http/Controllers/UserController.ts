import Bcrypt from "../../lib/Bcrypt";
import { Request } from "express";
import Constants from "../../utils/Constants";
import {
  ValidatedRequest,
  RegisterUserRequest,
  UserLoginRequest,
  UserVerifyAccountRequest,
  UserVerifyAccountJWTPayload,
  UserForgotPasswordRequest,
  UserResetPasswordRequest,
  UserResetPasswordJWTPayload,
  UserTwoFactorAuthSubmitRequest,
  UserTwoFactorAuthJWTPayload,
} from "../../lib/types";
import UserService from "../../services/UserService";
import {
  AccessTokenNotExpired,
  AuthLoginError,
  EmailExistsError,
  InternalServerError,
  InvalidRefreshToken,
  RefreshTokenExpired,
  UserAccountAlreadyVerified,
  UserDoesNotExistError,
  UserNotVerifiedError,
  UserResetPasswordError,
  UserTwoFactorAuthInvalidCode,
} from "../../utils/exceptions/Exceptions";
import Jwt from "../../lib/Jwt";
import GeneralHelper from "../../utils/helpers/GeneralHelper";

class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public async register(request: ValidatedRequest<RegisterUserRequest>) {
    if (await this.userService.emailExists(request.body.email)) {
      throw new EmailExistsError();
    }
    request.body.password = await Bcrypt.hash(request.body.password);
    const user = await this.userService.create(request.body);
    this.userService.sendRegisterMail(user);
    return user._id;
  }

  public async login(request: ValidatedRequest<UserLoginRequest>) {
    const user = await this.userService.emailExists(request.body.email);
    if (!user) {
      throw new AuthLoginError();
    }
    if (!(await Bcrypt.compare(request.body.password, user.password))) {
      throw new AuthLoginError();
    }
    if (!user.verified) {
      throw new UserNotVerifiedError();
    }
    const require_tfa = await this.userService.requireTFAProcess(
      user,
      request.body.tfa_token
    );
    if (user.two_factor_auth_enabled && require_tfa) {
      const code = this.userService.generateTwoFactorCode();
      const token = this.userService.generateMailToken(
        user,
        { code },
        Constants.jwt.mail_two_factor_expire
      );
      this.userService.sendTwoFactorAuthEmail(user, { code, token });
      return { tfa_token: token };
    }
    const tfaAuthToken = Jwt.sign({
      payload: { user_id: user._id },
      secretOrPrivateKey: Constants.jwt.tfa_auth_key,
      options: { expiresIn: Constants.jwt.tfa_auth_key_exp },
    });
    const session = await this.userService.saveSession(user._id.toString());
    return {
      user: GeneralHelper.withoutKeys(user, ["password"]),
      session,
      tfaAuthToken,
    };
  }

  public async reGenerateAccessToken(request: Request) {
    const session = request.session;
    if (!this.userService.tokenExpired(session.access_token_exp)) {
      throw new AccessTokenNotExpired();
    }
    if (session.refresh_token !== (request.headers.refresh_token as string)) {
      throw new InvalidRefreshToken();
    }
    if (this.userService.tokenExpired(session.refresh_token_exp)) {
      throw new RefreshTokenExpired();
    }

    const newSession = await this.userService.saveSession(
      request.session.user_id
    );

    await this.userService.deleteSessionByEntityId(session.entityId);
    return newSession;
  }

  public async logout(request: Request) {
    await this.userService.deleteSessionByEntityId(request.session.entityId);
    return true;
  }

  public async verifyAccount(
    request: ValidatedRequest<UserVerifyAccountRequest>
  ) {
    const decoded = Jwt.verify(
      request.body.token,
      Constants.jwt.mail_key
    ) as UserVerifyAccountJWTPayload;

    const user = await this.userService.findById(decoded.user_id);
    if (!user || user?.verified) {
      throw new UserAccountAlreadyVerified();
    }

    await this.userService.findByIdAndUpdate(user._id, { verified: true });
    return decoded.user_id;
  }

  public async forgotPassword(
    request: ValidatedRequest<UserForgotPasswordRequest>
  ) {
    const user = await this.userService.findOne({ email: request.body.email });
    if (user) {
      this.userService.sendForgotPasswordEmail(user);
    }
    return true;
  }

  public async resetPassword(
    request: ValidatedRequest<UserResetPasswordRequest>
  ) {
    const decoded = Jwt.verify(
      request.body.token,
      Constants.jwt.mail_key
    ) as UserResetPasswordJWTPayload;

    const user = await this.userService.findById(decoded.user_id);
    if (!user) {
      throw new UserDoesNotExistError();
    }

    const matchedOldPassword = await Bcrypt.compare(
      request.body.password,
      user.password
    );
    if (matchedOldPassword) {
      throw new UserResetPasswordError();
    }
    const newPassword = await Bcrypt.hash(request.body.password);
    await this.userService.findByIdAndUpdate(user._id, {
      password: newPassword,
    });
    return true;
  }

  public async twoFactorAuthSubmit(
    request: ValidatedRequest<UserTwoFactorAuthSubmitRequest>
  ) {
    const payload = Jwt.verify(
      request.body.token,
      Constants.jwt.mail_key
    ) as UserTwoFactorAuthJWTPayload;
    if (payload.code !== request.body.code) {
      throw new UserTwoFactorAuthInvalidCode();
    }
    const user = await this.userService.findById(payload.user_id, {
      select: "-password",
    });
    if (!user) {
      throw new InternalServerError();
    }
    const session = await this.userService.saveSession(user._id.toString());
    const tfaAuthToken = Jwt.sign({
      payload: { user_id: user._id },
      secretOrPrivateKey: Constants.jwt.tfa_auth_key,
      options: { expiresIn: Constants.jwt.tfa_auth_key_exp },
    });
    return { user, session, tfaAuthToken };
  }

  public me(request: Request) {
    return GeneralHelper.withoutKeys(request.user, ["password"]);
  }
}

export default new UserController();
