const router = require('express').Router()

const services = require('../services/icons')
const storage = require('../utils/storage')

// Yeni bir Ikon ekler.
router.post('/', storage.single('file'), services.create)

// Mevcut ikonu günceller.
router.patch('/', storage.single('file'), services.update)

// Ikonları listeler.
router.get('/', services.list)

module.exports = router

