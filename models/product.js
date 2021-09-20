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
        }
    },
    thumbnail: DataTypes.STRING,
    thumbnailPath: DataTypes.STRING,
    weight: DataTypes.STRING,
    description: DataTypes.TEXT,
    stock: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: true,
            notEmpty: true,
        }
    },
    totalIn: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: true,
            notEmpty: true,
        }
    },
    totalOut: {
        type: DataTypes.INTEGER,
        validate: {
            isInt: true,
            notEmpty: true,
        }
    }
}, {
    timestamps: false
});

module.exports = Product;