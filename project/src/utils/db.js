const { Sequelize } = require('sequelize')

const dbName = process.env.NODE_ENV === 'dev' ? process.env.PG_DB_TEST : process.env.PG_DB_LIVE
const dbUser = process.env.PG_USER
const dbPass = process.env.PG_PASS

const options = {
    dialect: 'postgres',
    host: process.env.PG_HOST,
    port: process.env.PG_TEST,
    encrypt: false,
    logging: false,
}

module.exports = new Sequelize(dbName, dbUser, dbPass, options)