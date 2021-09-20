const { DataTypes } = require('sequelize');
const connection = require('../db/connection');

const Category = connection.define('category', {
    name: {
        type: DataTypes.STRING(125),
        unique: true,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'Please enter name!'
            }
        }
    },
    icon: DataTypes.STRING(125),
    label: DataTypes.STRING(125),
    description: DataTypes.TEXT,
    parent_id: {
        type: DataTypes.INTEGER(11),
        allowNull: true
    }
});

Category.hasMany(Category, {
    foreignKey: 'parent_id',
    as: 'item'
});
Category.hasMany(Category, {
    foreignKey: 'parent_id',
    as: 'items'
});

module.exports = Category;