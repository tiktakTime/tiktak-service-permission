const { attributesR } = require('../repos')
const errorException = require("../utils/errorException");
const kafka = require("../utils/kafka");

exports.create = async (req, res) => {
    const { language, body, member } = req
    try {
        body.companyId = member.companyId
        await attributesR.create(body)
        await kafka.sendLog(member, 'attribute-create', req.originalUrl)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.update = async (req, res) => {
    const { language, body, member } = req
    try {
        await attributesR.update(body, { id: body.id, companyId: member.companyId })
        await kafka.sendLog(member, 'attribute-update', req.originalUrl)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.list = async (req, res) => {
    const { language, member } = req
    try {
        const list = await attributesR.list({ companyId: member.companyId, isActive: true })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.detail = async (req, res) => {
    const { language, params, member } = req
    try {
        const one = await attributesR.one({ id: params.id, companyId: member.companyId, isActive: true })
        res.status(200).send(one)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}