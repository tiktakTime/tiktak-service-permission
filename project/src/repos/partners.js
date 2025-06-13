const model = require('../models/partners')
model.sync({force: false})

exports.create = async body => {
    return await model.create(body).then(r => (r.get({ plain: true })))
}

exports.createBulk = async body => {
    return await model.bulkCreate(body)
}

exports.update = async (body, where) => {
    return await model.update(body, { where })
}

exports.list = async (where, options) => {
    return await model.findAll({ where, raw: true, ...options})
}

exports.one = async (where, options) => {
    return await model.findOne({ where, raw: true, ...options })
}

exports.destroy = async where => {
    return await model.destroy({ where })
}

exports.count = async where => {
    return await model.count({ where })
}