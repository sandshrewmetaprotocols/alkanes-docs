/**
 * Redis client for caching
 */
import { createClient, type RedisClientType } from 'redis';

let client: RedisClientType | null = null;
let connectionPromise: Promise<RedisClientType> | null = null;

/**
 * Get or create Redis client
 */
export async function getRedisClient(): Promise<RedisClientType | null> {
  const redisUrl = process.env.REDIS_URL;

  if (!redisUrl) {
    console.warn('REDIS_URL not configured, caching disabled');
    return null;
  }

  if (client?.isOpen) {
    return client;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      client = createClient({ url: redisUrl });

      client.on('error', (err) => {
        console.error('Redis client error:', err);
      });

      await client.connect();
      console.log('Redis connected');
      return client;
    } catch (error) {
      console.error('Failed to connect to Redis:', error);
      client = null;
      connectionPromise = null;
      throw error;
    }
  })();

  return connectionPromise;
}

/**
 * Cache wrapper with automatic serialization
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const redis = await getRedisClient();
    if (!redis) return null;

    const value = await redis.get(key);
    if (!value) return null;

    return JSON.parse(value) as T;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
}

/**
 * Cache set with automatic serialization
 */
export async function cacheSet<T>(
  key: string,
  value: T,
  ttlSeconds: number = 60
): Promise<void> {
  try {
    const redis = await getRedisClient();
    if (!redis) return;

    await redis.set(key, JSON.stringify(value), { EX: ttlSeconds });
  } catch (error) {
    console.error('Cache set error:', error);
  }
}

/**
 * Cache delete
 */
export async function cacheDel(key: string): Promise<void> {
  try {
    const redis = await getRedisClient();
    if (!redis) return;

    await redis.del(key);
  } catch (error) {
    console.error('Cache delete error:', error);
  }
}
