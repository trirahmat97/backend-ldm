const { DataTypes } = require('sequelize');
const connection = require('../db/connection');
const ProductJob = connection.define('poduct_job', {
    lokasi_pemasangan: {
        type: DataTypes.STRING
    },
    keterangan: {
        type: DataTypes.STRING
    },
    jumlah: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: true,
            notEmpty: true,
        }
    }
}, { timestamp: false });
module.exports = ProductJob;