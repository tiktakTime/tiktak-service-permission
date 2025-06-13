const router = require('express').Router()

const validates = require('../validations/attributes')
const services = require('../services/attributes')

// Yeni bir Attribute ekler.
router.post('/', validates.create, services.create)

// Bir Attribute günceller.
router.patch('/', validates.update, services.update)

// Attribute listeler (Firma için)
router.get('/', services.list)

// Attribute detayını verir.
router.get('/:id', services.detail)

module.exports = router

