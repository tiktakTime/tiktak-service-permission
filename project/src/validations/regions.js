const joi = require('joi')

exports.create = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        partnerId: joi.string().min(36).max(36).required(),
        name: joi.string().required(),
        leaderId: joi.string().min(36).max(36).required().allow('', null),
        leaderFirstName: joi.string().required().allow('', null),
        leaderLastName: joi.string().required().allow('', null),
        leaderAvatar: joi.string().required().allow('', null),
        address: joi.string().allow('', null)
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
        leaderId: joi.string().min(36).max(36).required().allow('', null),
        leaderFirstName: joi.string().required().allow('', null),
        leaderLastName: joi.string().required().allow('', null),
        leaderAvatar: joi.string().required().allow('', null),
        address: joi.string().required('', null)
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