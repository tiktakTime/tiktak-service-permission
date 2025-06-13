const router = require('express').Router()


router.use('/partners', require('./routes/partners'))
router.use('/regions', require('./routes/regions'))
router.use('/conditions', require('./routes/conditions'))
router.use('/works', require('./routes/works'))
router.use('/rooms', require('./routes/rooms'))
router.use('/icons', require('./routes/icons'))
router.use('/attributes', require('./routes/attributes'))

module.exports = router