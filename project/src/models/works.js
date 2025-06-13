/*
    Personel, yeni bir iş oluşturup işe başadığında burada onun için bir veri oluşturulur.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'works'
}

const columns = {
    id: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },
    workNumber: {
        type: DataTypes.INTEGER,
    },
    workNumberSpecial: {
        type: DataTypes.INTEGER,
    },
    partnerId: {
        type: DataTypes.UUID
    },
    regionId: {
        type: DataTypes.UUID
    },
    conditionId: {
        type: DataTypes.UUID
    },
    carId: {
        type: DataTypes.UUID
    },
    personId: {
        type: DataTypes.UUID
    },
    personFirstName: {
        type: DataTypes.STRING(255)
    },
    personLastName: {
        type: DataTypes.STRING(255)
    },
    personAvatar: {
        type: DataTypes.TEXT
    },
    companyId: {
        type: DataTypes.UUID
    },
    specialNote: {
        type: DataTypes.TEXT
    },
    totalMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        // Toplamda kaç dakika çalışma yapıldı.
    },
    totalHalfMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        // Toplamda kaç dakika mola yapıldı.
    },
    totalWorkMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        // Mola hariç toplamda kaç dakika çalışıldı.
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        /*
            1 -> İş Başlatıldı
            2 -> İş Molada
            3 -> Mola Zaman ile Senkron olsun diye 3 boş bırakıldı.
            4 -> İş Tamamlandı
        */
    },
    brand: {
        type: DataTypes.STRING(255)
    },
    model: {
        type: DataTypes.STRING(255)
    },
    plate: {
        type: DataTypes.STRING(255)
    },
    startDate: {
        type: DataTypes.DATE
    },
    endDate: {
        type: DataTypes.DATE
    },
    type: {
        type: DataTypes.INTEGER
        // Partner ID'nin çalışma türü.
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table