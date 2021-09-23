const { DataTypes } = require('sequelize');
const connection = require('../db/connection');

const Product = connection.define('product', {
    title: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please enter Title'
            }
        }
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please enter price!'
            }
        },
        defaultValue: 0
    },
    thumbnail: DataTypes.STRING,
    thumbnailPath: DataTypes.STRING,
    weight: DataTypes.STRING,
    description: DataTypes.TEXT,
    stock: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true,
        },
        defaultValue:0
    },
    totalIn: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true,
        },
        defaultValue: 0
    },
    totalOut: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: true,
        },
        defaultValue: 0
    }
}, {
    timestamps: false
});

module.exports = Product;