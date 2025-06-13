/*
    Personel, yeni bir iş oluşturup işe başadığında burada onun için bir veri oluşturulur.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'roomTypes'
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
    name: {
        type: DataTypes.STRING(255)
    },
    type: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        /*
            1 -> Oda Türü (Tek Oda, Dubleks Oda)
            2 -> Oda Çalışma Türü (Ayrılma, Konaklama)
        */
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table