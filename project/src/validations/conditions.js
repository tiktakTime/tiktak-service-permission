const joi = require('joi')

exports.create = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        name: joi.string().required(),
        partnerId: joi.string().min(36).max(36).required(),
        regionId: joi.string().min(36).max(36).required(),
        startTime: joi.string().required(),
        endTime: joi.string().required(),
        takeType: joi.number().required(),
        giveType: joi.number().required(),
        color: joi.string().required(),
        takePrice: joi.any().required(), // float
        givePrice: joi.any().required(), // float,
        code: joi.string().allow('', null),
        goKilometer: joi.number().allow('', null),
        comeKilometer: joi.number().allow('', null)
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.update = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        id: joi.string().min(36).max(36).required(),
        name: joi.string().required(),
        startTime: joi.string().required(),
        endTime: joi.string().required(),
        takeType: joi.number().required(),
        giveType: joi.number().required(),
        color: joi.string().required(),
        takePrice: joi.any().required(), // float
        givePrice: joi.any().required(), // float
        code: joi.string().allow('', null),
        goKilometer: joi.number().allow('', null),
        comeKilometer: joi.number().allow('', null)
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.id = (req, res, next) => {
    const { params } = req
    const rules = joi.object({
        id: joi.string().min(36).max(36).required()
    })
    const validate = rules.validate(params)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.copy = (req, res, next) => {
    const { params } = req
    const rules = joi.object({
        destinationId: joi.string().min(36).max(36).required(),
        targetId: joi.string().min(36).max(36).required()
    })
    const validate = rules.validate(params)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}