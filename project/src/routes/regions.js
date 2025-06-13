const router = require('express').Router()

const validates = require('../validations/regions')
const services = require('../services/regions')

// Yeni bir Region oluşturur.
router.post('/', validates.create, services.create)

// Mevcut bir Region günceller.
router.patch('/', validates.update, services.update)

// Mevcut bir Region siler.
router.delete('/:id', validates.id, services.delete)

// Bir Partner firmaya ait tüm Regionları döner.
router.get('/:id', validates.id, services.list)

// Bir Region'a ait detayı verir.
router.get('/one/:id', validates.id, services.byId)

module.exports = router

