/*
    Personel, yeni bir iş oluşturup işe başadığında burada onun için bir veri oluşturulur.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize : db,
    modelName : 'workTimes'
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
    dateTime: {
        type: DataTypes.DATE
    },
    status : {
        type : DataTypes.INTEGER,
        defaultValue : 1
        /*
            1 -> İş Başlatıldı
            2 -> Molaya Çıkıldı
            3 -> Moladan Dönüldü
            4 -> İş Tamamlandı
        */
    }
}

class table extends Model {
}

table.init(columns, options)

module.exports = table