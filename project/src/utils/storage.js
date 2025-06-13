require('dotenv').config()

const multer = require('multer')
const MulterAzureStorage = require('multer-azure-blob-storage').MulterAzureStorage;
const path = require('path')
const thisPath = require("path");

const azureStorage = new MulterAzureStorage({
    connectionString: 'DefaultEndpointsProtocol=https;AccountName=tiktak;AccountKey=S+9pFlx+wjMfWhARrsXC2/PtXg1w8aTgpLQVCZEKnqoy2JCsg144Rgok385WQWF5hVypXH4vvGYz+ASt4DvDjA==;EndpointSuffix=core.windows.net',
    accessKey: 'S+9pFlx+wjMfWhARrsXC2/PtXg1w8aTgpLQVCZEKnqoy2JCsg144Rgok385WQWF5hVypXH4vvGYz+ASt4DvDjA==',
    accountName: 'tiktak',
    containerName: 'tiktak',
    key: (req, file, callback) => {
        req.reqFileError = ''
        const fileExtension = thisPath.extname(file.originalname.toLocaleLowerCase())
        if (fileExtension === '.jpg' || fileExtension === '.jpeg' || fileExtension === '.png' || fileExtension === '.pdf') {
            file.originalname = `${Date.now()}${fileExtension}`
            callback(null, file.originalname)
        } else {
            req.reqFileError = 'BadFileExtension'
        }
    }
})

module.exports = multer({ storage: azureStorage });