const router = require('express').Router()

const validates = require('../validations/conditions')
const services = require('../services/conditions')

// Yeni bir Kondisyon oluşturur.
router.post('/', validates.create, services.create)

// Mevcut bir Kondisdyonu günceller.
router.patch('/', validates.update, services.update)

// Mevcut bir Kondisyonu siler.
router.delete('/:id', validates.id, services.delete)

// Region ID değerine göre tüm kondisyonları listeler.
router.get('/:id', validates.id, services.list)

// Kondisyon içinde ki Attribute düzenlemek için info alınan servis.
router.get('/attributes/:id', validates.id, services.attributesList)

// Kondisyona ait olacak Attributes seçeneklerini Mobil Uygulama için listeler.
router.get('/attributes/mobile/:id', validates.id, services.attributesListMobile)

// Kondisyona ait Attribute seçenekleri başka bir kondisyona kopyalanacak.
router.post('/attributes/copy', validates.copy, services.copy)

// Kondisyonun Attributes seçeneklerini günceller.
router.post('/attributes', services.attributesUpdate)

// Kondisyon ID bilgisine göre veri döner.
router.get('/one/:id', validates.id, services.byId)

module.exports = router

