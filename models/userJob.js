const connection = require('../db/connection');
const UserJob = connection.define('user_job', {}, { timestamp: false });
module.exports = UserJob;