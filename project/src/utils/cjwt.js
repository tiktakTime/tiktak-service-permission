const CJWT = require('crypted-jwt')

const options = {
    salt1: 13,
    salt2: 22,
    salt3: 18,
    jsonSecretKey: 'YakarsaDunyayiGariplerYakar',
    expiresIn: '365d',
    cryptoSecretKey: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3'
}

const CJ = new CJWT(options)

exports.createToken = async data => {
    return await CJ.createToken(data)
}

exports.parseToken = async token => {
    return await CJ.parseToken(token)
}