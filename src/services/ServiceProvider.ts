import { Entity, Repository, Schema } from "redis-om";
import Redis from "./Redis";

abstract class ServiceProvider {
  protected redisClient: Redis;

  constructor() {
    this.redisClient = new Redis();
  }

  protected async repository(
    schema: Schema<Entity>
  ): Promise<Repository<Entity>> {
    return await this.redisClient.fetchRepository(schema);
  }

  public toRedisJson(entity: Entity | null) {
    const newEntity = entity?.toRedisJson();
    return { ...newEntity, entityId: entity?.entityId };
  }
}

export default ServiceProvider;
