const redisClient = require('../config/redis_config');

// Check Redis client connection status
const checkRedisConnection = () => {
    if (redisClient.connected) {
        console.log('Redis client is connected');
    } else {
        console.log('Redis client is not connected');
    }
};

module.exports = { checkRedisConnection };
