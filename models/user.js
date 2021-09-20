const { DataTypes } = require('sequelize');
const connection = require('../db/connection');
const User = connection.define('user', {
    username: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    nama: {
        type: DataTypes.STRING(35),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    nomor_telpon:{
        type: DataTypes.STRING(14),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    alamat:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    jenis_kelamin:{
        type: DataTypes.ENUM,
        values: ['L', 'P'],
        allowNull: false,
    },
    tempat_lahir:{
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    tanggal_lahir:{
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    level:{
        type: DataTypes.ENUM,
        values: ['Admin', 'Super-Visior', 'Teknisi', 'QC'],
        allowNull: false,
        defaultValue: 'Teknisi'
    },
});
module.exports = User;