const { DataTypes } = require('sequelize');
const connection = require('../db/connection');
const ImageJob = require('./imageJob');
const Product = require('./product');
const ProductJob = require('./productJob');
const UserJob = require('./userJob');
const User = require('./user');
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
Job.hasMany(ImageJob);
Job.belongsToMany(Product, { through: ProductJob });
Job.belongsToMany(User, { through: UserJob });
module.exports = Job;