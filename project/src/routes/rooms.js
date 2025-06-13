const router = require('express').Router()

const validates = require('../validations/rooms')
const services = require('../services/rooms')

// Otel çalışanları kendi firmalarına ait RoomTypes değerlerini istedikleri gibi filterler.
router.get('/room-types/:parentId', services.roomTypes)

// Otel çalışanları, Kondisyona ait Otel Temizleme Typelerini alır.
router.get('/room-types/person/:parentId', services.roomTypesPerson)

// Firmaya ait tüm room türlerini listeler. (Admin paneli sayfası için)
router.get('/room-types-list/:type', services.roomTypesListForAdmin)

// Room Types kısmı için yeni bir Veri eklenmesini sağlar.
router.post('/room-types', validates.roomTypesC, services.roomTypesC)

// Room Types kısmı için bir Veri güncellemesiani sağlar.
router.patch('/room-types', validates.roomTypesU, services.roomTypesU)

// Firmanın tüm Room Attribute listesini verir.
router.get('/room-attributes/:conditionId', services.roomAttributes)

// Firmanın kendisi için Room Attribute oluşturmasını sağlar.
router.post('/room-attributes', validates.roomAttributesC, services.roomAttributesC)

// Firmanın kendisi için Room Attribute güncellemesini sağlar.
router.patch('/room-attributes', validates.roomAttributesU, services.roomAttributesU)

// Firmanın Room Condition listesini verir.
router.get('/room-conditions/:conditionId', services.roomConditions)

// Firmanın Room Condition eklemesini sağlar.
// router.post('/room-conditions', validates.roomConditionsC, services.roomConditionsC)

// Firmanın Room Condition güncellemesini sağlar.
router.patch('/room-conditions', services.roomConditionsU)

// Hotel temizlikçisinin yeni bir çalışma başlatmasını sağlar.
router.post('/room-work/open', validates.roomWorkCreate, services.roomWorkCreate)

// Hotel temizlikçisinin işi kapatmasını sağlar.
router.post('/room-work/close', validates.roomWorkClose, services.roomWorkClose)

// Hotel temizlikçisinin ilgili Work ID'ye göre Room Work listesini almasını sağlar.
router.get('/room-work/:id', validates.id, services.getRoomById)

// Hotel temizlikçisinin ilgili Work Room ID'ye göre Room Detail almasını sağlar.
router.get('/room/work/detail/:id', validates.id, services.getRoomWorkById)

module.exports = router

