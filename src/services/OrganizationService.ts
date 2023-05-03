import OrganizationModel from "../Http/Models/OrganizationModel";
import { CreateOrganization } from "../lib/types";

class OrganizationService {
  public async create(data: CreateOrganization) {
    return await OrganizationModel.create(data);
  }

  public async find(query = {}) {
    return await OrganizationModel.find(query).lean().exec();
  }

  public async findOne(query = {}) {
    return await OrganizationModel.findOne(query).lean().exec();
  }

  public async findOneAndDelete(query = {}) {
    return await OrganizationModel.findOneAndDelete(query).lean().exec();
  }
}

export default OrganizationService;
