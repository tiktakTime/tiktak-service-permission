require('dotenv').config()
const express = require('express')()

const parser = require('body-parser')
express.use(parser.json({ limit: '500kb' }))
express.use(parser.urlencoded({ limit: '500kb', extended: true }))

const redisAdaptor = require('./utils/redisAdaptor')

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

const {initialize, consumer} = require('./utils/kafka')
initialize().then(() => { consumer() })

express.listen(7014, () => {
    console.log('-------------------------------------------')
    console.log('Tiktak Service Permission')
    console.log('PORT: 7016')
    console.log(`Ortam: ${process.env.NODE_ENV}`)
    console.log('-------------------------------------------')
})