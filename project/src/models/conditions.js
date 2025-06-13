/*
    Kondisyonalrın bulunduğu yerdir.
*/

const {DataTypes, Model} = require('sequelize')
const db = require('../utils/db')

const options = {
    sequelize: db,
    modelName: 'conditions'
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
    partnerId: {
        type: DataTypes.UUID,
    },
    regionId: {
        type: DataTypes.UUID,
    },
    name: {
        type: DataTypes.STRING(255)
    },
    startTime: {
        type: DataTypes.TIME
    },
    endTime: {
        type: DataTypes.TIME
    },
    takePrice: {
        type: DataTypes.FLOAT
    },
    takeType: {
        type: DataTypes.INTEGER
        /*
            1 -> Dakika Başı Ücret
            2 -> Kilometre Başı Ücret
            3 -> Paket Başı Ücret
            4 -> Durak Başı Ücret
            5 -> Sabit Fiyat Ücret
            6 -> Yüzdelik Ücret (Taksiciye %33'ü Senin Diyebiliriz)
            7 -> Bilinmeyen Ücret (Taksinin bize ne kadar kazandıracağını bilemeyiz)
            8 -> Oda Başı Ücret (Oda Fiyatları Alt Parametrelerde Olabilir)
            9 -> Saat Başı Ücret
        */
    },
    givePrice: {
        type: DataTypes.FLOAT
    },
    giveType: {
        type: DataTypes.INTEGER
        /*
            1 -> Dakika Başı Ücret
            2 -> Kilometre Başı Ücret
            3 -> Paket Başı Ücret
            4 -> Durak Başı Ücret
            5 -> Sabit Fiyat Ücret
            6 -> Yüzdelik Ücret (Taksiciye %33'ü Senin Diyebiliriz)
            7 -> Bilinmeyen Ücret (Taksinin bize ne kadar kazandıracağını bilemeyiz)
            8 -> Oda Başı Ücret (Oda Fiyatları Alt Parametrelerde Olabilir)
            9 -> Saat Başı Ücret
        */
    },
    color: {
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
    code: {
        type: DataTypes.STRING(255)
    },
    goKilometer: {
        type: DataTypes.INTEGER,
        defaultValue: 0
        // Kullanıcı bu işi yapmaya giderken kaç kilometre gitti?
    },
    comeKilometer: {
        type: DataTypes.INTEGER,
        defaultValue: 0
        // Kullanıcı bu işi tamamladıktan sonra kaç kilometge geldi?
    }
}

class table extends Model {}
table.init(columns, options)

module.exports = table