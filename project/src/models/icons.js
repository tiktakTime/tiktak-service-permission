/*
    Attributes için seçilecek Ikonların listesinin tutulduğu yerdir.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'icons'
}

const columns = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    url: {
        type: DataTypes.TEXT
    },
    isVisible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table