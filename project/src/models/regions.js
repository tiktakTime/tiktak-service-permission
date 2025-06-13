/*
    Firmaların bölgelerinin bulunduğu yerdir.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'regions'
}

const columns = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    companyId: {
        type: DataTypes.UUID,
    },
    buildId: {
        type: DataTypes.UUID,
    },
    partnerId: {
        type: DataTypes.UUID
    },
    name: {
        type: DataTypes.STRING(255)
    },
    isArchive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    leaderId: {
        type: DataTypes.UUID
    },
    leaderFirstName: {
        type: DataTypes.STRING(255)
    },
    leaderLastName: {
        type: DataTypes.STRING(255)
    },
    leaderAvatar: {
        type: DataTypes.TEXT
    },
    address: {
        type: DataTypes.TEXT
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table