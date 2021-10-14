const response = require('../utils/response');

const authKey = async (req, res, next) => {
    try {
        const apikey = req.headers.apikey;
        if (!apikey && apikey === process.env.apikey) {
            throw new Error;
        }
        next();
    } catch (err) {
        res.status(401).json(response.auth('Invalid ApiKey'));
    }
};

module.exports = authKey;