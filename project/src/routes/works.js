const router = require('express').Router()

const validates = require('../validations/works')
const services = require('../services/works')

// Yeni bir Work oluşturur. (Anlık)
router.post('/', validates.create, services.create)

// Bir tane Work'un güncellenmesini sağlar.
router.patch('/', validates.update, services.update)

// Çalışmanın, çalışma zamanlarının güncellenmesini sağlar.
router.patch('/times/update', validates.timesUpdate, services.timesUpdate)

// Work için Mola Başlangıcı veya Mola Sonu yapar.
router.post('/half-time', validates.halfTime, services.halfTime)

// Bir çalışmayı tamamlar.
router.post('/end', validates.end, services.end)

// Kullanıcının bu güne ait olan ve daha önceden tamamlanmayan işlerini listeler.
router.get('/today/:type', services.today)

// Kullanıcının bu güne ait olan ve daha önceden tamamlanmayan işlerini listeler.
router.get('/date/:month/:year', services.before)

// Web tarafının Title bilgisini döner.
router.post('/filter/title', services.filterTitle)

// Web tarafının Body bilgisini döner.
router.post('/filter/body', services.filterBody)

// Araba Plakası ve Tarih gönderildiği zaman bu saatte hangi çalışmada ve kullanıcı olduğunu döndürür.
router.post('/punishment/search', services.punishmentSearch)

// Work ID'si ile detayı verilir.
router.get('/detail/:id', services.byId)

module.exports = router

