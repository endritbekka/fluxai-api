import { Client, Entity, Repository, Schema } from "redis-om";
import Constants from "../utils/Constants";
class Redis {
  protected client: Client;

  constructor() {
    this.client = new Client();
  }

  private async connect(): Promise<void> {
    if (!this.client.isOpen()) {
      await this.client.open(Constants.redis.url);
    }
  }

  private async disconnect(): Promise<void> {
    await this.client.close();
  }

  public async fetchRepository(
    schema: Schema<Entity>
  ): Promise<Repository<Entity>> {
    // TODO: Create a redis global connection.
    await this.connect();
    const repo = this.client.fetchRepository(schema);
    return repo;
  }
}

export default Redis;
