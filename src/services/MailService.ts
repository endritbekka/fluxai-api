import SendGrid from "@sendgrid/mail";
import { SendEmail, User } from "../lib/types";
import Constants from "../utils/Constants";
import path from "path";
import ejs from "ejs";

SendGrid.setApiKey(Constants.mail.api_key);

class MailTemplateClass {
  private async getTemplate(templateName: string, data: {}) {
    const filePath =
      path.dirname(__dirname) + `/views/email-templates/${templateName}`;
    return await ejs.renderFile(filePath, data);
  }
  public async forgotPasswordUserTemplate({
    user,
    token,
    url,
  }: {
    user: User;
    token: string;
    url: string;
  }): Promise<SendEmail> {
    return {
      email: user.email,
      subject: "Reset your password",
      template: await this.getTemplate("user-forgot-password.ejs", {
        token,
        url,
      }),
    };
  }
  public async registerUserTemplate(params: {
    user: User;
    token: string;
    url: string;
  }): Promise<SendEmail> {
    return {
      email: params.user.email,
      subject: "Verify your email",
      template: await this.getTemplate("register-user-template.ejs", {
        token: params.token,
        url: params.url,
      }),
    };
  }
  public async userTwoFactorAuth(
    user: User,
    data: { token: string; code: number }
  ): Promise<SendEmail> {
    return {
      email: user.email,
      subject: "Two factor authentication",
      template: await this.getTemplate("user-two-factor-auth.ejs", data),
    };
  }
}

class MailServiceClass {
  public send(data: SendEmail) {
    return SendGrid.send({
      from: Constants.mail.from_email,
      to: data.email,
      subject: data.subject,
      html: data.template,
    });
  }
}

export const MailTemplate = new MailTemplateClass();
export const MailService = new MailServiceClass();
