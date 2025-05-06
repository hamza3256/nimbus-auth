import { Redis } from '@upstash/redis'

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
})

export interface RateLimitOptions {
  // The maximum number of requests allowed within the time window
  limit: number
  // The time window in seconds
  window: number
}

export async function rateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 3, window: 3600 } // Default: 3 requests per hour
) {
  const key = `rate-limit:${identifier}`
  
  // Get the current count
  const count = await redis.get<number>(key) || 0
  
  // Check if we're over the limit
  if (count >= options.limit) {
    // Get TTL to know when rate limit expires
    const ttl = await redis.ttl(key)
    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      reset: new Date(Date.now() + ttl * 1000),
    }
  }
  
  // Increment the count
  await redis.incr(key)
  
  // Set expiration on first request
  if (count === 0) {
    await redis.expire(key, options.window)
  }
  
  // Get TTL to know when rate limit expires
  const ttl = await redis.ttl(key)
  
  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - (count + 1),
    reset: new Date(Date.now() + ttl * 1000),
  }
} 