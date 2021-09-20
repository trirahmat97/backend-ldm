const jwt = require('jsonwebtoken');
const config = require('../utils/key');

exports.verification = () => {
    return (req, res, next) => {
        let role = req.body.role;
        let tokenWithBearer = req.headers.authorization;
        if (tokenWithBearer) {
            let token = tokenWithBearer.split(' ')[1];
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ auth: false, message: 'Token tidak terdaftar' });
                } else {
                    if (role == 2) {
                        req.auth = decoded;
                        next();
                    } else {
                        return res.status(401).send({ auth: false, message: 'Role tidak valid' });
                    }
                }
            })
        } else {
            return res.status(401).send({ auth: false, message: 'Token tidak tersedia' });
        }
    }
}

exports.verification2 = (id) => {
    return (req, res, next) => {
        let tokenWithBearer = req.headers.authorization;
        if (tokenWithBearer) {
            let token = tokenWithBearer.split(' ')[1];
            jwt.verify(token, config.secret, (err, decoded) => {
                if (err) {
                    return res.status(401).send({ auth: false, message: 'Token tidak terdaftar' });
                } else {
                    if (id == 1) {
                        req.auth = decoded;
                        next();
                    } else {
                        return res.status(401).send({ auth: false, message: 'Role tidak valid' });
                    }
                }
            })
        } else {
            return res.status(401).send({ auth: false, message: 'Token tidak tersedia' });
        }
    }
}
