import Redis from "ioredis";

const redisUrl = process.env.REDIS_DATABASE_URL!;
console.log("redisUrl in redis/index.ts:", redisUrl);
const redis = new Redis(process.env.REDIS_DATABASE_URL!);

export default redis;