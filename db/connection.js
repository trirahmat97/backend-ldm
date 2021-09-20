const Sequelize = require('sequelize');
const config = require('../utils/config');
const connection = new Sequelize(config.dbname, config.dbusername, config.dbpassword, {
    host: config.host,
    dialect: config.dialect,
    define: {
        timestamps: false
    }
});

module.exports = connection;