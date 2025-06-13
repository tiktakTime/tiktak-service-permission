const joi = require('joi')

exports.create = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        partnerId: joi.string().min(36).max(36).required(),
        regionId: joi.string().min(36).max(36).required(),
        conditionId: joi.string().min(36).max(36).required(),
        carId: joi.string().min(36).max(36).required().allow('', null),
        specialNote: joi.string().allow('', null),
        values: joi.any().required(),
        brand: joi.string().required().allow('', null),
        model: joi.string().required().allow('', null),
        plate: joi.string().required().allow('', null),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.halfTime = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        workId: joi.string().min(36).max(36).required(),
        status: joi.number().required(),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.end = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        workId: joi.string().min(36).max(36).required(),
        specialNote: joi.string().allow('', null),
        values: joi.array().required()
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
        partnerId: joi.string().min(36).max(36).required(),
        regionId: joi.string().min(36).max(36).required(),
        conditionId: joi.string().min(36).max(36).required(),
        carId: joi.string().min(36).max(36).required().allow('', null),
        brand: joi.string().required().allow('', null),
        model: joi.string().required().allow('', null),
        plate: joi.string().required().allow('', null),
        specialNote: joi.string().allow('', null),
        values: joi.any().required(),
        startDate: joi.string(),
        endDate: joi.string(),
        totalMinutes: joi.number().required(),
        totalHalfMinutes: joi.number().required(),
        totalWorkMinutes: joi.number().required()
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.timesUpdate = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        id: joi.string().min(36).max(36).required(),
        dateTime: joi.string().required(),
        status: joi.number().required()
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