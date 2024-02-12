import { Redis } from "ioredis";
import { env } from "~/env.mjs";

const getRedisUrl = () => {
  if (env.REDIS_URL) return env.REDIS_URL;

  throw new Error("REDIS_URL not found in env");
};

export const redis = new Redis(getRedisUrl());
