const router = require('express').Router()

const validates = require('../validations/partners')
const services = require('../services/partners')

// Yeni bir Partner firma oluşturur.
router.post('/', validates.create, services.create)

// Mevcut bir Partner firmayı günceller.
router.patch('/', validates.update, services.update)

// Mevcut bir Partenr firmayı siler.
router.delete('/:id', validates.id, services.delete)

// Tüm partner firmaları listeler.
router.get('/', services.list)

// Partner ID'ye göre Partner bilgileri olacak.
router.get('/one/:id', validates.id, services.byId)

module.exports = router

