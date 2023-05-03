import { ValidatedRequest } from "express-joi-validation";
import {
  CreateEmailTemplateRequest,
  DeleteEmailTemplateRequest,
} from "../../lib/types";
import EmailTemplateService from "../../services/EmailTemplateService";
import { Request } from "express";

class EmailTemplateController {
  private emailTemplateService: EmailTemplateService;

  constructor() {
    this.emailTemplateService = new EmailTemplateService();
  }

  public async list(request: Request) {
    return await this.emailTemplateService.find({
      organization: request.organization._id,
    });
  }

  public async create(request: ValidatedRequest<CreateEmailTemplateRequest>) {
    request.body.organization = request.organization._id;
    return await this.emailTemplateService.create(request.body);
  }

  public async delete(request: ValidatedRequest<DeleteEmailTemplateRequest>) {
    return await this.emailTemplateService.findOneAndDelete({
      organization: request.organization._id,
      _id: request.query._id,
    });
  }
}

export default new EmailTemplateController();
