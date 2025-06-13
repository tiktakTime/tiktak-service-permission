const redisAdaptor = require('./redisAdaptor')
const cjwt = require('./cjwt')

exports.createRedisData = async (userId, platform, data) => {
    const token = await cjwt.createToken(data)
    const response = { ...data, token, platform }
    await redisAdaptor.set(`tt-${platform}-${userId}`, JSON.stringify(response))
    return response
}

exports.updateRedisData = async (userId, platform, data) => {
    const redisData = await redisAdaptor.get(`tt-${platform}-${userId}`)
    if (redisData) {
        await redisAdaptor.set(`tt-${platform}-${userId}`, JSON.stringify(data))
    }
}

exports.removeRedis = async key => {
    await redisAdaptor.remove(key)
}