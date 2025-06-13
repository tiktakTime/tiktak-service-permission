/*
    Personel, yeni bir iş oluşturup işe başadığında burada onun için bir veri oluşturulur.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'roomAttributes'
}

const columns = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    companyId: {
        type: DataTypes.UUID
    },
    conditionId: {
        type: DataTypes.UUID
    },
    name: {
        type: DataTypes.STRING(255)
    },
    takePrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    givePrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    order: {
        type: DataTypes.INTEGER,
        defaultValue: 999
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table