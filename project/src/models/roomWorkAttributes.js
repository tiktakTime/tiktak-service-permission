const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'roomWorkAttributes'
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
    roomWorkId: {
        type: DataTypes.UUID
    },
    attributeId: {
        type: DataTypes.UUID
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
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