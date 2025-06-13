const model = require('../models/roomConditions')
const types = require('../models/roomTypes')
model.sync({force: false})

model.belongsTo(types, {
    foreignKey: 'roomType1',
    as: 'cleanerTypes'
})

model.belongsTo(types, {
    foreignKey: 'roomType2',
    as: 'cleanerWorks'
})

exports.create = async body => {
    return await model.create(body).then(r => (r.get({plain: true})))
}

exports.createBulk = async body => {
    return await model.bulkCreate(body)
}

exports.update = async (body, where) => {
    return await model.update(body, {where})
}

exports.list = async (where, options) => {
    return await model.findAll({where, raw: true, ...options})
}

exports.listDetail = async (where, options) => {
    return await model.findAll({
        where,
        ...options,
        include: [
            {
                model: types,
                as: 'cleanerTypes',
                where: {
                    isActive: true
                }
            },
            {
                model: types,
                as: 'cleanerWorks',
                where: {
                    isActive: true
                }
            }
        ]
    })
}

exports.one = async (where, options) => {
    return await model.findOne({where, raw: true, ...options})
}

exports.destroy = async where => {
    return await model.destroy({where})
}

exports.count = async where => {
    return await model.count({where})
}