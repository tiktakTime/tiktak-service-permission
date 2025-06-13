/*
    Yeni bir Work için Value değerlerinin girildiği yerdir.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize : db,
    modelName : 'workValues'
}

const columns = {
    id : {
        primaryKey : true,
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
    },
    workId : {
        type: DataTypes.UUID
    },
    attributeId: {
        type: DataTypes.UUID
    },
    value : {
        type : DataTypes.STRING(255)
    }
}

class table extends Model {
}

table.init(columns, options)

module.exports = table