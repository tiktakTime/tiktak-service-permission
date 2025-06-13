/*
    Kondisyon altına açılmış olan Attribute Türlerini listeler.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'conditionAttributes'
}

const columns = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    conditionId: {
        type: DataTypes.UUID
    },
    attributeId: {
        type: DataTypes.UUID
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    step: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    screen: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    iconId: {
        type: DataTypes.UUID
    }
}

class table extends Model {
}

table.init(columns, options)

module.exports = table