const { Kafka, Partitioners } = require('kafkajs')

const topicName = process.env.NODE_ENV === 'dev' ? 'permission-test' : 'permission-live'
const groupId = 'GroupPartnerConsumer'

const kafka = new Kafka({
    clientId: 'tiktak-kafka',
    brokers: ['10.0.0.4:9092']
})

exports.initialize = async () => {
    const admin = await kafka.admin()
    await admin.connect()
    const topicList = await admin.listTopics()
    const isTopic = topicList.some(x => x === topicName)
    if (!isTopic) {
        await admin.createTopics({
            topics: [
                {
                    topic: topicName,
                    numPartitions: 10
                }
            ]
        })
    }
    await admin.disconnect()
}

exports.consumer = async () => {
    const consumer = await kafka.consumer({
        groupId,
    })
    await consumer.connect()
    await consumer.subscribe({
        topic: topicName,
        fromBeginning: true
    })
    await consumer.run({
        eachMessage: async ({ message, partition }) => {
            if (partition === 9) {
                updateDatabase(message.value)
            }
        }
    })
}

exports.producer = async data => {
    console.log(data)
    const producer = kafka.producer()
    await producer.connect()
    await producer.send({
        topic: data.topic,
        messages: data.messages,
    })
    await producer.disconnect()
}


const {permissionR, regionsR} = require('../repos')
const updateDatabase = async (message) => {
    const stringPayload = message.toString()
    const objectPayload = JSON.parse(stringPayload)

    if (objectPayload.title === 'person') {
        const {data} = objectPayload

        await regionsR.update({
            leaderFirstName: data.firstName,
            leaderLastName: data.lastName,
            leaderAvatar: data.avatar
        }, { leaderId: data.id })

        await permissionR.update({
            leaderFirstName: data.firstName,
            leaderLastName: data.lastName,
            leaderAvatar: data.avatar
        }, { leaderId: data.id })
    }
}

exports.sendLog = async (member, type, url) => {
    const { firstName, lastName, companyId, id } = member
    const kafkaProducer = kafka.producer({
        createPartitioner: Partitioners.LegacyPartitioner
    })
    await kafkaProducer.connect()
    await kafkaProducer.send({
        topic: 'logs-global',
        messages: [
            {
                partition: 0,
                value: JSON.stringify({
                    id,
                    firstName,
                    lastName,
                    type,
                    companyId,
                    url
                })
            }
        ]
    })
    await kafkaProducer.disconnect()
}