const { Op } = require('sequelize')
const {worksR, workTimesR, workValuesR, roomTypesR, roomWorksR, permissionR} = require('../repos')
const errorException = require('../utils/errorException')
const moment = require('moment')
const generateTitle = require('../utils/generateTitle')
const ProofOfWorkSwitch = require('../utils/proofOfWorkSwitch')
const kafka = require("../utils/kafka");

exports.create = async (req, res) =>  {
    const { language, body, member } = req
    try {
        // Bu kullanıcının mevcutta kapanmamış bir işi varsa yeni iş başlatamayacak.
        const checkMyWorks = await worksR.one({ personId: member.personId, companyId: member.companyId, status: [1, 2] })
        if (checkMyWorks) {
            throw 1000
        }
        const lastNumber = await worksR.getLastNumber()
        body.workNumber = lastNumber
        body.workNumberSpecial = lastNumber
        body.companyId = member.companyId
        body.personId = member.personId
        body.startDate = new Date()
        body.personFirstName = member.firstName
        body.personLastName = member.lastName
        body.personAvatar = member.avatar
        body.personName = `${member.firstName} ${member.lastName}`

        const thisPartner = await permissionR.one({ id: body.partnerId })
        body.type = thisPartner.type

        const newWork = await worksR.create(body)
        await workTimesR.create({
            workId: newWork.id,
            dateTime: new Date(),
            status: 1
        })

        // Bu kondisyona ait olan veri türlerini işlememiz lazım.
        const bulkValues = []
        const {values} = body
        for (let item of values) {
            console.log(item)
            bulkValues.push({ ...item, workId: newWork.id })

            // Gelen özellik kilometre tetiklememi istiyorsa..
            if (item.isKilometerTrigger) {
                const kafkaData = {
                    id: body.carId,
                    nowKilometer: item.value
                }
                const messages = [
                    {
                        partition: 9,
                        value: JSON.stringify({ title: 'car-kilometer', data: kafkaData })
                    }
                ]
                await kafka.producer({ topic: process.env.NODE_ENV === 'dev' ? 'cars-test' : 'cars-live', messages })
                await kafka.sendLog(member, 'car-update-kilometer', req.originalUrl)
            }
        }
        await workValuesR.createBulk(bulkValues)

        await kafka.sendLog(member, 'work-create', req.originalUrl)

        res.status(200).send({ id: newWork.id })
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.update = async (req, res) =>  {
    const { language, body, member } = req
    try {
        const work = await worksR.one({ id: body.id, companyId: member.companyId })
        if (!work) {
            throw 2000
        }

        const thisPartner = await permissionR.one({ id: body.partnerId })
        body.type = thisPartner.type

        // Bu kondisyona ait olan veri türlerini işlememiz lazım.
        const bulkValues = []
        const {values} = body
        for (let item of values) {
            bulkValues.push({ ...item, workId: body.id })

            // Gelen özellik kilometre tetiklememi istiyorsa..
            if (item.isKilometerTrigger) {
                const kafkaData = {
                    id: body.carId,
                    nowKilometer: item.value
                }
                const messages = [
                    {
                        partition: 9,
                        value: JSON.stringify({ title: 'car-kilometer', data: kafkaData })
                    }
                ]
                await kafka.producer({ topic: process.env.NODE_ENV === 'dev' ? 'cars-test' : 'cars-live', messages })
                await kafka.sendLog(member, 'car-update-kilometer', req.originalUrl)
            }
        }
        await workValuesR.destroy({ workId: body.id }) // Eski verileri öncelikle siliyorum.
        await workValuesR.createBulk(bulkValues) // Güncellenen verileri set ediyorum.

        await worksR.update(body, { id: body.id })

        // Toplam çalışma süresini ve toplam mola süresini hesaplamam gerekiyor.
        const allTimes = await workTimesR.list({workId: body.id}, { order: [['dateTime', 'ASC']] })

        const startObject = allTimes.find(x => x.status === 1)
        const startDate = new Date(startObject.dateTime)

        const finishObject = allTimes.find(x => x.status === 4)
        const finishDate = new Date(finishObject.dateTime)

        // Milisaniye olarak ikisinin arasında ki farkı alıyorum.
        const diffrenceMilliseond = finishDate - startDate
        const diffrenceMinutes = Math.floor((diffrenceMilliseond / 1000) / 60)

        // Toplamda yapılan mola dakikalarını hesaplayıp yazmam gerekiyor.
        const filterHalfTimes = allTimes.filter(x => x.status === 2 || x.status === 3)
        const spliceHalfTimeArray = []

        // [0,1], [2,3] gibi mola saatlerini parçalıyorum.
        for (let i = 0; i < filterHalfTimes.length; i = i + 2) {
            spliceHalfTimeArray.push(filterHalfTimes.slice(i, i + 2))
        }

        // Toplam mola dakikasını hesapladım. Thanks JetBrains AI
        const totalHalfTime = spliceHalfTimeArray.reduce((total, [start, end]) => {
            const startTime = new Date(start.dateTime)
            const endTime = new Date(end.dateTime)
            const diff = endTime - startTime
            const minutes = Math.floor((diff / 1000) / 60)
            return total + minutes
        }, 0)
        const totalWorkTimes = diffrenceMinutes - totalHalfTime

        // Mevcut işi Update ediyorum.
        await worksR.update({
            totalHalfMinutes: totalHalfTime,
            totalMinutes: diffrenceMinutes,
            totalWorkMinutes: totalWorkTimes,
        }, { id: body.id })
        
        await kafka.sendLog(member, 'work-update', req.originalUrl)

        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.timesUpdate = async (req, res) => {
    const { language, body, member } = req
    try {
        await workTimesR.update(body, { id: body.id })
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.halfTime = async (req, res) => {
    const { language, body, member } = req
    try {
        // Öncelikle bu kullanıcının bu çalışmaya sahip olup olmadığına bakıyoruz.
        const work = await worksR.one({ id: body.workId, personId: member.personId })
        if (!work) {
            throw 1001
        }

        // Kullanıcının, mevcut iş içerisinde molaya çıkmasını veya moladan dönmesini sağlar.
        body.dateTime = new Date()
        await workTimesR.create(body)
        await worksR.update({ status: body.status === 2 ? 2 : 1 }, { id: body.workId })
        await kafka.sendLog(member, `work-half-time-${body.status}`, req.originalUrl)

        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.end = async (req, res) => {
    const { language, body, member } = req
    try {
        // Öncelikle bu kullanıcının bu çalışmaya sahip olup olmadığına bakıyoruz.
        const work = await worksR.one({ id: body.workId, personId: member.personId})
        if (!work) {
            throw 1001
        }
        if (work.status === 2) {
            throw 1002
        }
        if (work.status === 4) {
            throw 1003
        }

        const date = new Date()
        await workTimesR.create({
            workId: body.workId,
            dateTime: date,
            status: 4,
        })

        // Toplam çalışma süresini ve toplam mola süresini hesaplamam gerekiyor.
        const allTimes = await workTimesR.list({workId: body.workId}, { order: [['dateTime', 'ASC']] })

        const startObject = allTimes.find(x => x.status === 1)
        const startDate = new Date(startObject.dateTime)

        const finishObject = allTimes.find(x => x.status === 4)
        const finishDate = new Date(finishObject.dateTime)

        // Milisaniye olarak ikisinin arasında ki farkı alıyorum.
        const diffrenceMilliseond = finishDate - startDate
        const diffrenceMinutes = Math.floor((diffrenceMilliseond / 1000) / 60)

        // Toplamda yapılan mola dakikalarını hesaplayıp yazmam gerekiyor.
        const filterHalfTimes = allTimes.filter(x => x.status === 2 || x.status === 3)
        const spliceHalfTimeArray = []

        // [0,1], [2,3] gibi mola saatlerini parçalıyorum.
        for (let i = 0; i < filterHalfTimes.length; i = i + 2) {
            spliceHalfTimeArray.push(filterHalfTimes.slice(i, i + 2))
        }

        // Toplam mola dakikasını hesapladım. Thanks JetBrains AI
        const totalHalfTime = spliceHalfTimeArray.reduce((total, [start, end]) => {
            const startTime = new Date(start.dateTime)
            const endTime = new Date(end.dateTime)
            const diff = endTime - startTime
            const minutes = Math.floor((diff / 1000) / 60)
            return total + minutes
        }, 0)
        const totalWorkTimes = diffrenceMinutes - totalHalfTime

        // Mevcut işi Update ediyorum.
        await worksR.update({
            totalHalfMinutes: totalHalfTime,
            totalMinutes: diffrenceMinutes,
            totalWorkMinutes: totalWorkTimes,
            status: 4,
            specialNote: body.specialNote,
            endDate: date,
        }, { id: body.workId })

        // Bu kondisyona ait olan veri türlerini işlememiz lazım.
        const bulkValues = []
        body.values.forEach(item => {
            bulkValues.push({ ...item, workId: body.workId })
        })
        console.log(bulkValues)
        await workValuesR.createBulk(bulkValues)
        await kafka.sendLog(member, `work-end`, req.originalUrl)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.today = async (req, res) => {
    const { language, member, params } = req
    try {
        const start = new Date()
        const end = new Date()

        start.setHours(0, 1, 0 ,0)
        end.setHours(23, 59, 0, 0)

        // Kullanıcının öncelikle bu gün ki verilerini alıyorum.
        const todayWorks = await worksR.listWithIncludes({
            personId: member.personId,
            type: params.type,
            createdAt: {
                [Op.between]: [start, end]
            }
        }, { order: [['createdAt', 'DESC']] })
            .then(response => {
                return response.map(element => (element.get({ plain: true })))
            })

        // Kullanıcının mevcutta bulunan açık işlerini alıyorum ama bu güne ait olmayan.
        const oldOpenWorks = await worksR.listWithIncludes({
            personId: member.personId,
            status: [1, 2],
            createdAt: {
                [Op.notBetween]: [start, end]
            }
        }).then(response => {
            return response.map(element => (element.get({ plain: true })))
        })

        // Devam eden işi aldım.
        const findOpenWork = todayWorks.findIndex(x => x.status === 1)
        if (findOpenWork !== -1) {
            const openWork = todayWorks[findOpenWork]
            // Aktif işim temizlik modülü ise gidip alt iş durumuna bakacağım.
            if (openWork.partner?.type === 3) {
                const roomWork = await roomWorksR.one({
                    workId: openWork.id,
                    personId: member.personId,
                    isClosed: false,
                })
                todayWorks[findOpenWork].cleanStatus = roomWork
            }
        }

        // Eski Devam eden işi aldım. (OLD)
        const findOldOpenWork = oldOpenWorks.findIndex(x => x.status === 1)
        if (findOldOpenWork !== -1) {
            const openWork = oldOpenWorks[findOldOpenWork]
            // Aktif işim temizlik modülü ise gidip alt iş durumuna bakacağım.
            if (openWork.partner?.type === 3) {
                const roomWork = await roomWorksR.one({
                    workId: openWork.id,
                    personId: member.personId,
                    isClosed: false,
                })
                oldOpenWorks[findOldOpenWork].cleanStatus = roomWork
            }
        }

        const isWorking = todayWorks.filter(x => x.status !== 4)
        let isNewWork = oldOpenWorks.length > 0 ? false : isWorking.length > 0 ? false : true
        res.status(200).send({ isNewWork, oldOpenWorks, todayWorks })
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.before = async (req, res) => {
    const { language, member, params } = req
    try {
        const getMonthStartEndDates = (year, month) => {
            const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 1, 0, 0))
            const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 0, 0))
            return { startDate, endDate }
        }
        const dates = getMonthStartEndDates(params.year, params.month)

        // Kullanıcının iki tarih arasında ki tüm verilerini alıyorum.
        const myWorks = await worksR.listWithIncludes({
            personId: member.personId,
            createdAt: {
                [Op.between]: [dates.startDate, dates.endDate]
            }
        }, { order: [['createdAt', 'DESC']] })

        // Daha sonra, bu verilere ek olarak bu işlerde yapılan toplam hesaplamaları da listeye ekliyorum.
        // TODO: Burası ileride Jenerik olabilir, nasıl olacağına bakacağız :)
        const totals = {
            totalHour: 0,
            totalWorkHour: 0,
            totalHalfMinutes: 0,
            diffDayCount: 0,
            workCount: myWorks.length,
        }
        const workingDays = []
        myWorks.forEach(item => {
            totals.totalHour += item.totalMinutes
            totals.totalWorkHour += item.totalWorkMinutes
            totals.totalHalfMinutes += item.totalHalfMinutes

            // Kaç farklı günde çalışılmış bunu buluyorum.
            const thisDay = moment(item.startDate).format('YYYY-MM-DD')
            const isSome = workingDays.some(x => x === thisDay)
            if (!isSome) {
                totals.diffDayCount += 1
                workingDays.push(thisDay)
            }
        })

        console.log(totals)

        res.status(200).send({ totals, myWorks })
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.filterTitle = async (req, res) => {
    const { language, member, body } = req
    try {
        const filter = {
            companyId: member.companyId,
            ...body
        }

        const works = await worksR.listWithIncludesForWebFilter(filter)
            .then(response => {
                return response.map(item => {
                    return {
                        ...item,
                        personName: `${item.personFirstName} ${item.personLastName}`
                    }
                })
            })
        const titles = await generateTitle(works, false, body.status === 0 ? true : false)
        res.status(200).send(titles)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.filterBody = async (req, res) => {
    const { language, member, body } = req
    try {
        const startDate = body.startDate
        const endDate = body.endDate

        delete body.startDate
        delete body.endDate

        const type = body.type
        if (body.type === 0) {
            delete body.type
        }

        const filter = {
            companyId: member.companyId,
            ...body
        }

        if (startDate && endDate) {
            filter.startDate = {
                [Op.gte]: startDate
            }

            filter.endDate = {
                [Op.lte]: endDate
            }
        } else if (startDate) {

            filter.startDate = {
                [Op.gte]: startDate
            }
        } else if (endDate) {
            filter.endDate = {
                [Op.lte]: endDate
            }
        } else {}

        const works = await worksR.listWithIncludesForWebFilter(filter)
            .then(response => {
                const resp = []
                for (let item of response) {
                    item = item.get({plain:true})
                    resp.push({
                        ...item,
                        personName: `${item.personFirstName} ${item.personLastName}`

                    })
                }
                return resp
            })

        const titles = await generateTitle(works, true, type === 0 ? true : false)

        const staticTotalFields = {}

        const rows = []
        works.forEach(item => {
            const workValues = []
            item.workValues.forEach(work => {
                const name = work.attribute?.name
                workValues.push({
                    name,
                    value: work.value
                })
            })

            const thisObject = {}
            const objOptions = {}
            titles.forEach((obj, index) => {
                const key = obj.key
                if (key === 'workValues') {
                    const find = workValues.find(x => x.name === obj.name)
                    if (find) {
                        thisObject[`column-${index+1}`] = find.value
                        objOptions[find.name] = find.value
                    } else {
                        thisObject[`column-${index+1}`] = null
                    }
                } else {
                    const splitKey = key.split('.')

                    const value = eval(`item.${key}`)
                    thisObject[key] = ProofOfWorkSwitch(key, value, language)
                    if (key === 'totalMinutes' || key === 'totalHalfMinutes' || key === 'totalWorkMinutes') {
                        let beforeData = staticTotalFields[key]
                        if (!beforeData || isNaN(beforeData)) {
                            beforeData = 0
                        }
                        staticTotalFields[key] = value + beforeData
                    }
                }
            })

            rows.push({ id: item.id, row: thisObject, objOptions })
        })

        const response = {
            totalFields: {},
            rows
        }

        if (rows.length > 0) {

            // Mevcut Response üzerinden Toplamlar dönülecek.
            const totalFields = rows[0].objOptions

            rows.forEach(item => {
                Object.keys(totalFields).forEach(key => {
                    totalFields[key] = parseInt(totalFields[key]) + parseInt(item.objOptions[key] || 0)
                })
            })

            response.totalFields = {
                ...staticTotalFields,
                ...totalFields,
            }

            const staticTitles = [
                {
                    name: 'Toplam İş Saati',
                    key: 'totalMinutes'
                },
                {
                    name: 'Toplam Mola Saati',
                    key: 'totalHalfMinutes'
                },
                {
                    name: 'Toplam Çalışma Saati',
                    key: 'totalWorkMinutes'
                }
            ]

            Object.keys(response.totalFields).forEach(key => {
                if (key === 'totalMinutes' || key === 'totalHalfMinutes' || key === 'totalWorkMinutes') {
                    const newValue = ProofOfWorkSwitch(key, response.totalFields[key], language)
                    const findTitle = staticTitles.find(x => x.key === key)
                    response.totalFields[findTitle.name] = newValue
                    delete response.totalFields[key]
                }
            })

            response.totalFields['Toplam İş Sayısı'] = rows.length
        } else {
            response.totalFields = {}
        }

        console.log(response.totalFields)
        res.status(200).send(response)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.byId = async (req, res) => {
    const { params, language, member } = req
    try {
        const list = await worksR.listWithIncludes({id: params.id, companyId: member.companyId})
        const item = list[0].get({ plain: true }) || {}
        if (item) {
            const options = {
                status: ProofOfWorkSwitch('status', item.status),
                totalMinutes: ProofOfWorkSwitch('totalMinutes', item.totalMinutes),
                totalHalfMinutes: ProofOfWorkSwitch('totalHalfMinutes', item.totalHalfMinutes),
                totalWorkMinutes: ProofOfWorkSwitch('totalWorkMinutes', item.totalWorkMinutes),
                startDate: ProofOfWorkSwitch('startDate', item.startDate),
                endDate: ProofOfWorkSwitch('endDate', item.endDate)
            }
            item.options = options
        }

        // Bu bilgilere ek olarak tüm giriş-çıkış (Mola) bilgilerini de döneceğiz.
        const workTimes = await workTimesR.list({ workId: params.id }, { order: [['createdAt', 'DESC']], attributes: ['id', 'dateTime', 'status'] })
            .then(response => {
                return response.map(item => {
                    return {
                        id: item.id,
                        dateTime: item.dateTime,
                        statusKey: item.status,
                        status: item.status === 1 ? 'İş Başlatıldı' : item.status === 2 ? 'Molaya Çıkıldı' : item.status === 3 ? 'Moladan Dönüldü' : 'İş Tamamlandı'
                    }
                })
            })
        item.times = workTimes
        delete item.workTimes

        res.status(200).send(item)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.punishmentSearch = async (req, res) => {
    const { body, language, member } = req
    const dateTime = new Date(body.date)
    try {
        const list = await worksR.listWithIncludes({
            plate: body.plate,
            [Op.and]: [
                {
                    startDate: {
                        [Op.lte]: new Date(body.date)
                    },
                    endDate: {
                        [Op.gte]: new Date(body.date)
                    }
                }
            ]
        })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}