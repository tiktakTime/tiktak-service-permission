/*
    Personel, yeni bir iş oluşturup işe başadığında burada onun için bir veri oluşturulur.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')
const {date} = require("joi");

const options = {
    sequelize: db,
    modelName: 'roomWorks'
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
    workId: {
        type: DataTypes.UUID
    },
    roomConditionId: {
        type: DataTypes.UUID
    },
    personId: {
        type: DataTypes.UUID
    },
    startTime: {
        type: DataTypes.DATE
    },
    endTime: {
        type: DataTypes.DATE
    },
    roomNumber: {
        type: DataTypes.STRING(255)
    },
    totalMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    isClosed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isChecked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    checkerPersonId: {
        type: DataTypes.UUID,
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table