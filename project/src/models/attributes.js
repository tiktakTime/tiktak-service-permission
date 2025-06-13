/*
    Hangi çalışma türü altına hangi verilerin geleceğinin listelendiği yerdir.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'attributes'
}

const columns = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING(255)
    },
    type: {
        type: DataTypes.STRING(255) // -> veri türü. genelde string.
    },
    parent: {
        type: DataTypes.INTEGER // -> grup türü. transfer, temizlik vs.
    },
    companyId: {
        type: DataTypes.UUID
    },
    info: {
        type: DataTypes.TEXT
    },
    iconId: {
        type: DataTypes.UUID
    },
    isKilometerTrigger: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table