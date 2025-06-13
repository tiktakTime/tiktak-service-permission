const errorMessages = require('./errorMessages.json')

module.exports = (error, language = 'TR') => {

    if (typeof(error) !== 'number') {
        console.log('----------------------------')
        console.log(new Date())
        console.log(error)
        return {
            "code": 500,
            language,
            "text": "Server Fatal Error!"
        }
    }

    const getCode = errorMessages.filter(x => x.code === error)
    if (!getCode) {
        return {
            "code": 400,
            "language": "TR",
            "text": "Hata Kodu Bulunamadı"
        }
    }

    const { messages } = getCode[0]
    const getText = messages.filter(x => x.language === language)
    if (!getText) {
        return {
            "code": 400,
            "language": "TR",
            "text": "Hata Mesajı Bulunamadı"
        }
    }

    console.log(`System Error! Error Code: ${error}`)
    console.log(error)

    return { code: 400, error, ...getText[0] }
}