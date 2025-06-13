const EasyRedisConnector = require('easy-redis-connector')

const options = {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS
}

module.exports = new EasyRedisConnector(options)