const router = require('express').Router()

router.use('/attributes', require('./routes/attributes'))

module.exports = router