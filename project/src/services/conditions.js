const { conditionsR, conditionAttributesR, partnersR, attributesR} = require('../repos')
const errorException = require('../utils/errorException')
const kafka = require('../utils/kafka')
const { v4: uuidv4 } = require('uuid')

exports.create = async (req, res) =>  {
    const { language, body, member } = req
    try {
        body.companyId = member.companyId
        await conditionsR.create(body)
        await kafka.sendLog(member, 'condition-create', req.originalUrl)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.update = async (req, res) =>  {
    const { language, body, member } = req
    try {
        await conditionsR.update(body, { id: body.id, companyId: member.companyId })
        await kafka.sendLog(member, 'condition-update', req.originalUrl)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.delete = async (req, res) =>  {
    const { language, body, member } = req
    try {
        await conditionsR.update({ isArchive: true }, { id: body.id, companyId: member.companyId })
        await kafka.sendLog(member, 'condition-delete', req.originalUrl)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.list = async (req, res) =>  {
    const { language, body, member } = req
    try {
        const list = await conditionsR.list({ isArchive: false, companyId: member.companyId, regionId: body.id })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.attributesList = async (req, res) =>  {
    const { language, body, member } = req
    try {

        const thisCondition = await conditionsR.one({ id: body.id })
        const thisPartner = await partnersR.one({ id: thisCondition.partnerId })
        const thisAttributes = await attributesR.list({ parent: thisPartner.type, companyId: member.companyId })

        const step1Attributes = Object.assign([], thisAttributes)
        const step1List = await conditionAttributesR.listWithIncludes({conditionId: body.id, step: 1 }, { order: [['order', 'ASC']] })

        let prevScreen1 = -1
        let step1ListFinal = []
        step1List.forEach((item, index) => {
            const findIndex = step1Attributes.findIndex(x => x.id === item.attributeId)
            if (findIndex !== -1) {
                step1Attributes.splice(findIndex, 1)
            }

            const attribute = item.attribute

            if (index > 0) {
                if (step1List[prevScreen1].screen !== item.screen) {
                    step1ListFinal.push({ attributeId: uuidv4(), name: '', type: 'divider' })
                    step1ListFinal.push(attribute)
                } else {
                    step1ListFinal.push(attribute)
                }
                prevScreen1 = prevScreen1 + 1
            } else {
                prevScreen1 = prevScreen1 + 1
                step1ListFinal.push(attribute)
            }
        })


        const step2Attributes = Object.assign([], thisAttributes)
        const step2List = await conditionAttributesR.listWithIncludes({conditionId: body.id, step: 2 }, { order: [['order', 'ASC']] })

        let prevScreen2 = -1
        let step2ListFinal = []
        step2List.forEach((item, index) => {
            const findIndex = step2Attributes.findIndex(x => x.id === item.attributeId)
            if (findIndex !== -1) {
                step2Attributes.splice(findIndex, 1)
            }

            const attribute = item.attribute
            if (index > 0) {
                if (step2List[prevScreen2].screen !== item.screen) {
                    step2ListFinal.push({ attributeId: uuidv4(), name: '', type: 'divider' })
                    step2ListFinal.push(attribute)
                } else {
                    step2ListFinal.push(attribute)
                }
                prevScreen2 = prevScreen2 + 1
            } else {
                prevScreen2 = prevScreen2 + 1
                step2ListFinal.push(attribute)
            }
        })

        res.status(200).send({
            step1Attributes,
            step1List: step1ListFinal,
            step2Attributes,
            step2List: step2ListFinal
        })
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.attributesListMobile = async (req, res) =>  {
    const { language, body, member } = req
    try {
        const list = await conditionAttributesR.listWithIncludes({ conditionId: body.id }, { order: [['order', 'ASC']] })
        const step1 = []
        const step2 = []
        list.forEach(item => {
            if (item.step === 1) {
                step1.push(item)
            } else {
                step2.push(item)
            }
        })
        res.status(200).send({step1, step2})
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.copy = async () => {
    const { language, body, member } = req
    try {
        const allAttributes = await conditionAttributesR.list({ conditionId: body.destinationId })
        const bulkData = []
        allAttributes.forEach(item => {
            let data = item
            delete data.id
            bulkData.push(data)
        })

        await conditionAttributesR.destroy({ conditionId: body.targetId })
        await conditionAttributesR.createBulk(bulkData)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.attributesUpdate = async (req, res) => {
    const { language, body, member } = req
    try {
        await conditionAttributesR.destroy({ conditionId: body.id })

        let bulkData = []
        let tempData = []

        let screen1 = 0
        let screen2 = 0

        body.step1.forEach((item, index) => {
            if (item.id) {
                tempData.push({
                    conditionId: body.id,
                    attributeId: item.id,
                    order: item.index,
                    step: item.step,
                    screen: screen1
                })
                if (index + 1 === body.step1.length) {
                    bulkData = bulkData.concat(tempData)
                    tempData = []
                }
            } else {
                screen1 = screen1 + 1
                bulkData = bulkData.concat(tempData)
                tempData = []
            }
        })

        body.step2.forEach((item, index) => {
            if (item.id) {
                tempData.push({
                    conditionId: body.id,
                    attributeId: item.id,
                    order: item.index,
                    step: item.step,
                    screen: screen2
                })
                if (index + 1 === body.step2.length) {
                    bulkData = bulkData.concat(tempData)
                    tempData = []
                }
            } else {
                screen2 = screen2 + 1
                bulkData = bulkData.concat(tempData)
                tempData = []
            }
        })

        await conditionAttributesR.createBulk(bulkData)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.byId = async (req, res) =>  {
    const { language, body, member } = req
    try {
        const one = await conditionsR.one({ id: body.id, companyId: member.companyId })
        res.status(200).send(one)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}