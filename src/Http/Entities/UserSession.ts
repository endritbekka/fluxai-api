import { Entity, Schema } from "redis-om";
import Redis from "../../services/Redis";

export class UserSession extends Entity {}

const schema = new Schema(UserSession, {
  user_id: { type: "string" },
  access_token: { type: "string" },
  refresh_token: { type: "string" },
  access_token_exp: { type: "number" },
  refresh_token_exp: { type: "number" },
});

async function createIndex() {
  const repository = await new Redis().fetchRepository(schema);
  await repository.createIndex();
}

createIndex();

export const userSessionSchema = schema;
