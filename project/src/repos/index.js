const permissionR = require('./permission')
const regionsR = require('./regions')
const conditionsR = require('./conditions')
const conditionAttributesR = require('./conditionAttributes')
const attributesR = require('./attributes')
const worksR = require('./works')
const workTimesR = require('./workTimes')
const workValuesR = require('./workValues')
const iconsR = require('./icons')

const roomTypesR = require('./roomTypes')
const roomWorksR = require('./roomWorks')
const roomWorkAttributesR = require('./roomWorkAttributes')
const roomAttributesR = require('./roomAttributes')
const roomConditionsR = require('./roomConditions')

module.exports = {
    roomWorkAttributesR,
    roomAttributesR,
    roomConditionsR,
    roomTypesR,
    roomWorksR,
    permissionR,
    regionsR,
    conditionsR,
    conditionAttributesR,
    attributesR,
    worksR,
    workTimesR,
    workValuesR,
    iconsR
}