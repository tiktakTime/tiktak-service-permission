const {iconsR} = require('../repos')
const errorException = require('../utils/errorException')

exports.create = async (req, res) =>  {
    const { language, file } = req
    try {
        await iconsR.create({ url: `${process.env.S3_URL}${file.blobName}` })
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.update = async (req, res) =>  {
    const { language, body, file, member } = req
    try {
        if (file) {
            body.file = `${process.env.S3_URL}${file.blobName}`
        }
        await iconsR.update(body, { id: body.id })
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
        const list = await iconsR.list({ isVisible: true })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.list = async (req, res) =>  {
    const { language } = req
    try {
        const list = await iconsR.list({ isVisible: true }, { attributes: ['id', 'url', 'isVisible'] })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}