const Sequelize = require('sequelize');
// const config = require('../utils/config');
// const config = process.env;
const connection = new Sequelize(process.env.dbname, process.env.dbusername, process.env.dbpassword, {
    host: process.env.host,
    dialect: process.env.dialect,
    define: {
        timestamps: false
    }
});

module.exports = connection;