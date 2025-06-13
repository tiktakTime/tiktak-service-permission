const {roomTypesR, roomWorksR, roomWorkAttributesR, roomAttributesR, roomConditionsR} = require('../repos')
const errorException = require('../utils/errorException')

exports.roomTypesPerson = async (req, res) => {
    const {language, params, member} = req
    try {
        const roomConditions = await roomConditionsR.listDetail({
            conditionId: params.parentId,
            companyId: member.companyId,
            isActive: true,
        })

        const response = []
        roomConditions.forEach(item => {
            const element = item.get({plain: true})
            const findIndex = response.findIndex(x => x.roomType2 === element.roomType2)
            if (findIndex === -1) {
                response.push({
                    id: element.id,
                    roomType2: element.roomType2,
                    name: element.cleanerWorks?.name,
                    rooms: [
                        {
                            id: element.cleanerTypes?.id,
                            name: element.cleanerTypes?.name
                        }
                    ]
                })
            } else {
                response[findIndex].rooms.push({
                    id: element.cleanerTypes?.id,
                    name: element.cleanerTypes?.name
                })
            }
        })

        res.status(200).send(response)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomTypes = async (req, res) => {
    const {language, params, member} = req
    try {
        const rows = []
        const columns = []
        const selectRows = []
        const selectColumns = []

        // Mevcutta bulunan Row-Column İlişkileri
        const roomConditions = await roomConditionsR.list({
            conditionId: params.parentId,
            companyId: member.companyId,
            isActive: true,
        }, {attributes: ['id', 'roomType1', 'roomType2', 'takePrice', 'givePrice']})

        // Rows
        const roomTypes1 = await roomTypesR.list({
            companyId: member.companyId,
            isActive: true,
            type: 1
        }, {attributes: ['id', 'name']})

        // Columns
        const roomTypes2 = await roomTypesR.list({
            companyId: member.companyId,
            isActive: true,
            type: 2
        }, {attributes: ['id', 'name']})

        roomTypes1.forEach(item => {
            const isSome = roomConditions.some(x => x.roomType1 === item.id)
            if (isSome) {
                rows.push(item)
            } else {
                selectRows.push(item)
            }
        })

        // Rows'a veri aktarımı tamamladnıktan sonra Alfabetik olarak SORT ediyoruz.
        rows.sort((a, b) => a.name.localeCompare(b.name))

        roomTypes2.forEach(item => {
            const filter = roomConditions.filter(x => x.roomType2 === item.id)
            if (filter.length === 0) {
                selectColumns.push(item)
            } else {
                columns.push({
                    ...item,
                    columnRows: filter
                })
            }
        })

        // Columns alanına veri işlemi tamamlandıktan sonra artık ColumnRows alanında ki veirleri Rows sırasına göre yapıyoruz.
        columns.forEach(column => {
            column.columnRows.sort((a, b) => {
                let aIndex = rows.findIndex(row => row.id === a.roomType2)
                let bIndex = rows.findIndex(row => row.id === b.roomType2)
                return aIndex - bIndex
            })
        })

        res.status(200).send({rows, columns, selectRows, selectColumns})
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomTypesListForAdmin = async (req, res) => {
    const {language, params, member} = req
    try {
        const list = await roomTypesR.list({
            type: params.type || 1,
            companyId: member.companyId,
        }, { order: [['name', 'ASC']] })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomTypesC = async (req, res) => {
    const {language, body, member} = req
    try {
        body.companyId = member.companyId
        await roomTypesR.create(body)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomTypesU = async (req, res) => {
    const {language, body, member} = req
    try {
        await roomTypesR.update(body, {id: body.id, companyId: member.companyId})
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomAttributes = async (req, res) => {
    const {language, member, params} = req
    try {
        const list = await roomAttributesR.list({
            isActive: true,
            companyId: member.companyId,
            conditionId: params.conditionId,
        }, { order: [['name', 'ASC']] })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomAttributesC = async (req, res) => {
    const {language, member, body} = req
    try {
        body.companyId = member.companyId
        await roomAttributesR.create(body)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomAttributesU = async (req, res) => {
    const {language, member, body} = req
    try {
        await roomAttributesR.update(body, {id: body.id, companyId: member.companyId})
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomConditions = async (req, res) => {
    const {language, member, params} = req
    try {
        const list = await roomConditionsR.list({
            isActive: true,
            companyId: member.companyId,
            conditionId: params.conditionId
        })
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomConditionsC = async (req, res) => {
    const {language, member, body} = req
    try {
        body.companyId = member.companyId
        await roomConditionsR.create(body)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomConditionsU = async (req, res) => {
    const {language, member, body} = req
    try {
        const {conditionId, data} = body

        await roomConditionsR.update({isActive: false}, {conditionId})

        for (let column of data) {
            for (let rowColumns of column.columnRows) {
                if (rowColumns.id) {
                    await roomConditionsR.update({
                        roomType1: rowColumns.roomType1,
                        roomType2: rowColumns.roomType2,
                        takePrice: rowColumns.takePrice,
                        givePrice: rowColumns.givePrice,
                        isActive: true
                    }, {id: rowColumns.id})
                } else {
                    await roomConditionsR.create({
                        companyId: member.companyId,
                        conditionId,
                        roomType1: rowColumns.roomType1,
                        roomType2: column.id,
                        takePrice: rowColumns.takePrice,
                        givePrice: rowColumns.givePrice,
                        isActive: true
                    })
                }
            }
        }

        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomWorkCreate = async (req, res) => {
    const {language, body, member} = req
    try {
        body.companyId = member.companyId
        body.personId = member.personId
        body.startTime = new Date()
        await roomWorksR.create(body)
        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.roomWorkClose = async (req, res) => {
    const {language, body, member} = req
    try {
        const thisWork = await roomWorksR.one({id: body.roomWorkId})

        // Arada ki çalışma zamanını buluyorum.
        const startTime = new Date(thisWork.startTime)
        const endTime = new Date()
        const diff = endTime - startTime
        const totalMinutes = Math.floor((diff / 1000) / 60)

        await roomWorksR.update({isClosed: true, endTime, totalMinutes}, { id: thisWork.id })

        // Daha sonradan ise Attributes bilgilerini ekleyeceğiz.
        const bulk = []
        body.attributes.forEach(item => {
            bulk.push({
                companyId: member.companyId,
                roomWorkId: body.roomWorkId,
                attributeId: item.attributeId,
                isActive: item.isActive
            })
        })
        await roomWorkAttributesR.createBulk(bulk)

        res.status(200).send()
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.getRoomById = async (req, res) => {
    const {language, body, member} = req
    try {
        const list = await roomWorksR.list({workId: body.id}, {order: [['startTime', 'ASC']]})
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}

exports.getRoomWorkById = async (req, res) => {
    const {language, body, member} = req
    try {
        const list = await roomWorksR.one({workId: body.id})
        res.status(200).send(list)
    } catch (e) {
        console.log(e)
        const error = await errorException(e, language)
        res.status(400).send(error)
    }
}