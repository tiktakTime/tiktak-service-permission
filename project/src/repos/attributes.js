const model = require('../models/attributes')
const icon = require('../models/icons')
model.sync({force: false})

model.belongsTo(icon, {
    foreignKey: 'iconId'
})

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
    return await model.findAll({ where, include:[{ model: icon }], ...options})
}

exports.one = async (where, options) => {
    return await model.findOne({ where, include:[{ model: icon }], ...options })
}

exports.destroy = async where => {
    return await model.destroy({ where })
}

exports.count = async where => {
    return await model.count({ where })
}