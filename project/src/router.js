const router = require('express').Router()

router.get('/', (req, res) => {
    res.send('Permission service is working 🚀')
})

module.exports = router