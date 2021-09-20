require('dotenv').config();
const config = require('../config');
const azureStorage = require('azure-storage');
const getStream = require('into-stream');
const { BlobServiceClient } = require("@azure/storage-blob");

const blobService = azureStorage.createBlobService();
const containerName = 'wsdata';

const getBlobName = originalName => {
    const indentifier = Math.random().toString().replace(/0\./, '');
    return `${indentifier}-${originalName}`;
}

exports.uploadFile = (req) => {
    const blobName = getBlobName(req.originalname);
    const stream = getStream(req.buffer);
    const streamLength = req.buffer.length;
    const data = blobService.createBlockBlobFromStream(containerName, blobName, stream, streamLength, (err, result) => {
        if (err) {
            return err;
        }
        return result;
    });
    return response = {
        name: data.name,
        url: `https://${config.getStorageAccountName()}.blob.core.windows.net/${containerName}/${data.name}`
    }
}

exports.deleteFile = async (req) => {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION);
    const containerClient = await blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(req);
    await blockBlobClient.delete();
}