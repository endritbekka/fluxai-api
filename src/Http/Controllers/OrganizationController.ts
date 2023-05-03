import { Request } from "express";
import { ValidatedRequest } from "express-joi-validation";
import {
  CreateOrganizationRequest,
  DeleteOrganizationRequest,
} from "../../lib/types";
import OrganizationService from "../../services/OrganizationService";

class OrganizationController {
  private organizationService: OrganizationService;

  constructor() {
    this.organizationService = new OrganizationService();
  }

  public async create(request: ValidatedRequest<CreateOrganizationRequest>) {
    request.body.user = request.session.user_id;
    return await this.organizationService.create(request.body);
  }

  public async list(request: Request) {
    return await this.organizationService.find({
      user: request.session.user_id,
    });
  }

  public async delete(request: ValidatedRequest<DeleteOrganizationRequest>) {
    return await this.organizationService.findOneAndDelete({
      user: request.session.user_id,
      _id: request.query.id,
    });
  }
}

export default new OrganizationController();
