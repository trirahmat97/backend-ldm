const { DataTypes } = require('sequelize');
const connection = require('../db/connection');
const Job = connection.define('job', {
    deskripsi: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please enter Deskripsi!'
            }
        }
    },
    alamat: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    pic_gedung:{
        type: DataTypes.STRING(35),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    no_telpon_pic:{
        type: DataTypes.STRING(14),
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    catatan:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    detail:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    status_teknisi:{
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Progress', 'Pending', 'Done'],
        defaultValue: 'Pending'
    },
    status_supervisor:{
        type: DataTypes.ENUM,
        allowNull: false,
        values: ['Progress', 'Pending', 'Done'],
        defaultValue: 'Pending'
    },
    tanggal_pemasangan:{
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    file: {
        type: DataTypes.STRING
    }
});

module.exports = Job;