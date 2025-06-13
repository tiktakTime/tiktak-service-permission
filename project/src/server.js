require('dotenv').config()
const express = require('express')()

const parser = require('body-parser')
express.use(parser.json({ limit: '500kb' }))
express.use(parser.urlencoded({ limit: '500kb', extended: true }))

express.use(async(req, res, next) => {
    console.log(req.originalUrl)
    if (req.headers.rediskey) {
        const data = await redisAdaptor.get(req.headers.rediskey)
        req.member = JSON.parse(data)
        req.token = req.headers.token
    }
    req.platform = req.headers.platform
    req.language = req.headers.language || 'TR'
    next()
})

express.use('/permission', require('./router'))

express.listen(7015, () => {
    console.log('-------------------------------------------')
    console.log('Tiktak Service Permission')
    console.log('PORT: 7015')
    console.log(`Ortam: ${process.env.NODE_ENV}`)
    console.log('-------------------------------------------')
})