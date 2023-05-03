import UserModel from "../Http/Models/UserModel";
import {
  RegisterUser,
  User,
  UserTwoFactorSavedTokenJWTPayload,
} from "../lib/types";
import crypto from "crypto";
import { userSessionSchema } from "../Http/Entities/UserSession";
import ServiceProvider from "./ServiceProvider";
import Constants from "../utils/Constants";
import { ObjectId } from "mongoose";
import Jwt from "../lib/Jwt";
import { MailService, MailTemplate } from "./MailService";
import { FrontRedirects } from "../utils/FrontRedirects";
import { InvalidToken } from "../utils/exceptions/Exceptions";
import GeneralHelper from "../utils/helpers/GeneralHelper";

class UserService extends ServiceProvider {
  public async emailExists(email: string) {
    return await UserModel.findOne({ email }).lean().exec();
  }
  public async create(data: RegisterUser) {
    return await UserModel.create(data);
  }
  public async findById(id: string | ObjectId, options = { select: "" }) {
    return await UserModel.findById(id).select(options.select).lean().exec();
  }
  public async findByIdAndUpdate(id: string, data: object) {
    return await UserModel.findByIdAndUpdate(id, data).lean().exec();
  }
  public async findOne(data: object) {
    return await UserModel.findOne(data).lean().exec();
  }
  public async requireTFAProcess(user: User, token?: string): Promise<boolean> {
    if (!token) return true;
    const [decoded, err] = await GeneralHelper.catchException(
      () =>
        Jwt.verify(
          token,
          Constants.jwt.tfa_auth_key
        ) as UserTwoFactorSavedTokenJWTPayload
    );
    if (err || user._id.toString() !== decoded?.user_id.toString()) return true;
    return false;
  }
  public async sendRegisterMail(user: User) {
    MailService.send(
      await MailTemplate.registerUserTemplate({
        user: user,
        token: this.generateMailToken(user),
        url: FrontRedirects.VERIFY_ACCOUNT,
      })
    );
  }
  public async sendTwoFactorAuthEmail(
    user: User,
    data: { token: string; code: number }
  ) {
    MailService.send(await MailTemplate.userTwoFactorAuth(user, data));
  }
  public async sendForgotPasswordEmail(user: User) {
    MailService.send(
      await MailTemplate.forgotPasswordUserTemplate({
        user,
        token: this.generateMailToken(user),
        url: FrontRedirects.RESET_PASSWORD,
      })
    );
  }
  public async deleteSessionByEntityId(entityId: string) {
    const repository = await this.repository(userSessionSchema);
    return await repository.remove(entityId);
  }
  public generateToken() {
    return crypto.randomBytes(30).toString("hex");
  }
  public generateTwoFactorCode(length = 5) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  public generateMailToken(user: User, payload = {}, expiresIn = "1h") {
    return Jwt.sign({
      payload: { user_id: user._id, ...payload },
      secretOrPrivateKey: Constants.jwt.mail_key,
      options: { expiresIn: expiresIn },
    });
  }
  public getAccessTokenExpire() {
    const currentTime = new Date().getTime();
    const fiveMinutesLater = new Date(currentTime + 5 * 60 * 1000).getTime();
    return fiveMinutesLater;
  }
  public getRefreshTokenExpire() {
    const currentTime = new Date().getTime();
    const twoDaysLater = new Date(
      currentTime + 2 * 24 * 60 * 60 * 1000
    ).getTime();
    return twoDaysLater;
  }
  public tokenExpired(exp: number) {
    return new Date().getTime() >= exp;
  }
  public async findSession(key: string, token: string) {
    const repository = await this.repository(userSessionSchema);
    return await repository
      .search()
      .where(key)
      .is.equalTo(token)
      .return.first();
  }
  public async saveSession(user_id: string) {
    const repository = await this.repository(userSessionSchema);
    return await repository.createAndSave({
      user_id: user_id,
      access_token: this.generateToken(),
      refresh_token: this.generateToken(),
      access_token_exp: this.getAccessTokenExpire(),
      refresh_token_exp: this.getRefreshTokenExpire(),
    });
  }
}

export default UserService;
