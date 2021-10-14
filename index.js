const app = require('./server');
const connection = require('./db/connection');

const port = process.env.port || 5000;
app.listen(port, async () => {
    try {
        await connection.authenticate();
        await connection.sync({ force: false });
        console.log('Connection has been connect in database and server port: ' + port);
    } catch (error) {
        console.error('Unable to connect to the database: ', error.message);
    }
});