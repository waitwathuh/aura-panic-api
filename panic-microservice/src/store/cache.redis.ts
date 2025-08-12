import Redis from 'ioredis';
import { config } from '../config';

const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  username: config.redis.username,
  password: config.redis.password,
  lazyConnect: true,
  tls: config.redis.password ? {} : undefined // ElastiCache with TLS if configured
});

export const cache = {
  async get<T>(key: string): Promise<T | null> {
    const json = await redis.get(key);
    return json ? JSON.parse(json) as T : null;
  },

  async set(key: string, value: any, ttlMs: number): Promise<void> {
    const seconds = Math.ceil(ttlMs / 1000);
    await redis.set(key, JSON.stringify(value), 'EX', seconds);
  },

  async delete(key: string): Promise<void> {
    await redis.del(key);
  },

  async clear(): Promise<void> {
    // Not advisable in prod; placeholder for parity
  }
};
