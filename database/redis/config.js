require('dotenv').config()
const RedisStore = require('connect-redis').default
const { createClient } = require('redis')
const redisClient = createClient({
  url: process.env.REDIS_URL
})

redisClient.connect().catch(console.error)

// Initialize store.
const redisStore = new RedisStore({
  client: redisClient,
  prefix: 'myapp:'
})

module.exports = redisStore
