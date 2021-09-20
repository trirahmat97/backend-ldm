const { DataTypes } = require('sequelize');
const connection = require('../db/connection');


const ImageJob = connection.define('image_job', {
    thumbnail: DataTypes.STRING,
    thumbnailPath: DataTypes.STRING,
    keterangan: {
        type: DataTypes.STRING
    }
}, { timestamp: false });
module.exports = ImageJob;