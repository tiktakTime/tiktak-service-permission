const joi = require('joi')

exports.roomTypesC = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        name: joi.string().required(),
        type: joi.number().required(),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.roomTypesU = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        id: joi.string().min(36).max(36).required(),
        name: joi.string().required(),
        type: joi.number().required(),
        isActive: joi.any().required().allow('', null)
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.roomWorkCreate = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        workId: joi.string().min(36).max(36).required(),
        roomConditionId: joi.string().min(36).max(36).required(),
        roomNumber: joi.string().required()
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.roomWorkClose = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        roomWorkId: joi.string().min(36).max(36).required(),
        attributes: joi.any().required(),
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

exports.roomAttributesC = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        conditionId: joi.string().min(36).max(36).required(),
        name: joi.string().required(),
        takePrice: joi.any().required().allow('', null),
        givePrice: joi.any().required().allow('', null),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.roomAttributesU = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        id: joi.string().min(36).max(36).required(),
        conditionId: joi.string().min(36).max(36).required(),
        name: joi.string().required(),
        takePrice: joi.any().required().allow('', null),
        givePrice: joi.any().required().allow('', null),
        isActive: joi.any().required().allow('', null),
        order: joi.number().required(),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}

exports.roomConditionsC = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        conditionId: joi.string().min(36).max(36).required(),
        roomType1: joi.string().min(36).max(36).required(),
        roomType2: joi.string().min(36).max(36).required(),
        takePrice: joi.any().required().allow('', null),
        givePrice: joi.any().required().allow('', null),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}