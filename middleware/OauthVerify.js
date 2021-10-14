const jwt = require('jsonwebtoken');
const response = require('../utils/response');

exports.verification = async (req, res, next) => {
    try{
        let tokenWithBearer = req.headers.authorization;
        if(!tokenWithBearer){
            return res.status(401).json(response.auth('Authorization Required!'));
        }
        let token = tokenWithBearer.split(' ')[1];
        const decoded = await jwt.verify(token, process.env.secret);
        if((decoded.user.level !== 'Admin') && (decoded.user.level !== 'Super-Visior') ){
            res.status(200).json(response.auth('Role Invalid to Access!'));
        }else{
            next();
        }
    }catch(err){
        // res.status(401).json(response.auth('Invalid Authorization!'));
        res.status(401).json(response.auth(err.mesage));
    }
}
