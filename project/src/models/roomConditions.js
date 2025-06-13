const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'roomConditions'
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
        // Hangi Kondisyon altında ki veri?
    },
    roomType1: {
        type: DataTypes.UUID,
        // roomTypes içinde ki Type 1, yani Oda Türü
    },
    roomType2: {
        type: DataTypes.UUID
        // roomTypes için de ki Type 2, yani Oda Çalışma Türü
    },
    takePrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    givePrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table