const redisConnection = () => {
    const Redis = require('ioredis')
    const redis = new Redis({
        port: 16714,
        host: 'redis-16714.c264.ap-south-1-1.ec2.cloud.redislabs.com',
        username: 'default',
        password: 'rnarjzWT1rXblqAmPmxaEDCn5I80YWT4',
        db: 0
    })
    return redis

}

module.exports = redisConnection