const {Op} = require('sequelize')
const model = require('../models/works')
const partner = require('../models/partners')
const region = require('../models/regions')
const condition = require('../models/conditions')
const attributes = require('../models/attributes')
const workTimes = require('../models/workTimes')
const workValues = require('../models/workValues')
const roomWorks = require('../models/roomWorks')
const roomWorkAttributes = require('../models/roomWorkAttributes')
const roomAttributes = require('../models/roomAttributes')
const icons = require('../models/icons')

model.sync({force: false})

model.hasMany(workTimes, {
    foreignKey: 'workId'
})

model.belongsTo(partner, {
    foreignKey: 'partnerId'
})

model.belongsTo(region, {
    foreignKey: 'regionId'
})

model.belongsTo(condition, {
    foreignKey: 'conditionId'
})

workValues.belongsTo(attributes, {
    foreignKey: 'attributeId'
})

model.hasMany(workValues, {
    foreignKey: 'workId'
})

model.hasMany(roomWorks, {
    foreignKey: 'workId'
})

roomWorks.hasMany(roomWorkAttributes, {
    foreignKey: 'roomWorkId'
})

roomWorkAttributes.belongsTo(roomAttributes, {
    foreignKey: 'attributeId'
})

attributes.belongsTo(icons, {
    foreignKey: 'iconId'
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

exports.listWithIncludes = async (where, options) => {
    return await model.findAll({
        where, ...options,
        attributes: ['id', 'personId', 'workNumber', 'workNumberSpecial', 'specialNote', 'totalMinutes', 'totalHalfMinutes', 'totalWorkMinutes', 'status', 'startDate', 'endDate', 'brand', 'model', 'plate', 'createdAt'],
        order: [[workTimes, 'createdAt', 'ASC']],
        include: [
            {
                model: partner,
                attributes: ['id', 'name', 'type']
            },
            {
                model: region,
                attributes: ['id', 'name']
            },
            {
                model: condition,
                attributes: ['id', 'name', 'startTime', 'endTime', 'color']
            },
            {
                model: workTimes,
                attributes: ['dateTime', 'status'],
                order: [['cratedAt', 'ASC']]
            },
            {
                required: false,
                model: workValues,
                attributes: ['value'],
                include: [
                    {
                        required: false,
                        model: attributes,
                        attributes: ['id', 'name'],
                        include: [
                            {
                                model: icons,
                                attributes: ['url']
                            }
                        ]
                    }
                ]
            },
            {
                required: false,
                model: roomWorks,
                attributes: ['isChecked', 'isClosed', 'roomNumber', 'totalMinutes'],
                include: [
                    {
                        required: false,
                        model: roomWorkAttributes,
                        attributes: ['attributeId', 'isActive', 'isChecked'],
                        include: [
                            {
                                required: false,
                                model: roomAttributes,
                                attributes: ['name']
                            }
                        ]
                    }
                ]
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

exports.getLastNumber = async () => {
    return await model.findAll({
        limit: 1,
        order: [['workNumber', 'DESC']],
        raw: true,
    }).then(r => (r.length > 0 ? r[0].workNumber + 1 : 1000))
}

exports.listWithIncludesForWebFilter = async where => {
    return await model.findAll({
        where,
        attributes: ['id', 'workNumber', 'workNumberSpecial', 'specialNote', 'totalMinutes', 'totalHalfMinutes', 'totalWorkMinutes', 'status', 'startDate', 'endDate', 'brand', 'model', 'plate', 'createdAt', 'personId', 'personFirstName', 'personLastName'],
        order: [[workTimes, 'createdAt', 'ASC']],
        include: [
            {
                model: partner,
                attributes: ['id', 'name', 'type']
            },
            {
                model: region,
                attributes: ['id', 'name']
            },
            {
                model: condition,
                attributes: ['id', 'name', 'startTime', 'endTime', 'color']
            },
            {
                model: workTimes,
                attributes: ['dateTime', 'status'],
                order: [['cratedAt', 'ASC']]
            },
            {
                required: false,
                model: workValues,
                include: [
                    {
                        required: false,
                        model: attributes
                    }
                ]
            }
        ]
    })
}