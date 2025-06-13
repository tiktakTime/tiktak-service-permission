const joi = require('joi')

exports.create = (req, res, next) => {
    const { body } = req
    const rules = joi.object({
        name: joi.string().required(),
        info: joi.string().allow('', null),
        parent: joi.number().required(),
        isKilometerTrigger: joi.boolean().required(),
        iconId: joi.string().required(),
        type: joi.string().allow('', null)
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
        id: joi.string().required(),
        name: joi.string().required(),
        info: joi.string().allow('', null),
        isKilometerTrigger: joi.boolean().required(),
        isActive: joi.boolean().required(),
        iconId: joi.string().required(),
    })
    const validate = rules.validate(body)
    if (validate.error) {
        res.status(406).send(validate.error)
    } else {
        req.body = validate.value
        next()
    }
}