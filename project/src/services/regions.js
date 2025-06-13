const { regionsR, partnersR} = require('../repos')
const errorException = require('../utils/errorException')
const kafka = require("../utils/kafka");

exports.create = async (req, res) =>  {
    const { language, body, member } = req
    try {
        body.companyId = member.companyId
        await regionsR.create(body)
        await kafka.sendLog(member, 'region-create', req.originalUrl)
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
        await regionsR.update(body, { id: body.id, companyId: member.companyId })
        await kafka.sendLog(member, 'region-update', req.originalUrl)
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
        await regionsR.update({ isArchive: true }, { id: body.id, companyId: member.companyId })
        await kafka.sendLog(member, 'region-delete', req.originalUrl)
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
        const list = await regionsR.list({ isArchive: false, companyId: member.companyId, partnerId: body.id }, { order: [['createdAt', 'ASC']] })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.byId = async (req, res) =>  {
    const { language, body, member } = req
    try {
        const one = await regionsR.one({ id: body.id, companyId: member.companyId })
        res.status(200).send(one)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}