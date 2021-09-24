const bcrypt = require('bcryptjs');
const response = require('../utils/response');
const message = require('../utils/responseMessage');
const User = require('../models/user');
const Job = require('../models/job');
const jwt = require('jsonwebtoken');

const config = require('../utils/key');

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? ++page : 1;
    const totalPages = Math.ceil(totalItems / limit);

    return { totalItems, rows, totalPages, currentPage };
};

exports.login = async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({
            where: {username: username},
            attributes: ['username', 'password', 'nama', 'level', 'id']
        });
        if (!user) {
            res.status(200).json(response.bad('Invalid Username or Password!'));
        }
        const doMatch = await bcrypt.compare(password, user.password);
        const exp = Math.floor(Date.now() / 1000) + (60 * 60);
        if (doMatch) {
            const token = jwt.sign({user}, config.secret, {expiresIn: exp});
            const data = {
                userId: user.id,
                access_token: token,
                access_type: 'Bearer',
                expires: exp,
                role: user.level,
                name: user.nama
            }
            return res.status(200).json(response.ok(data, "Login Success!"));
        }
        return res.status(200).json(response.bad('Invalid Username or Password!'));
    } catch (err) {
        res.status(400).json(response.bad(err.message));
    }
};

exports.findAllUser = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page-1, size);
    try {
        const findUser = await User.findAndCountAll({ where: {}, limit, offset });
        const responses = getPagingData(findUser, page-1, limit);
        res.status(200).json(response.ok(responses, message.fetch));
    } catch (err) {
        res.status(400).json(response.bad(err.message));
    }
};

exports.findAllUserId = async (req, res) => {
    const userId = req.params.userId;
    try {
        const findUser = await User.findOne({
            where: {id: userId},
            attributes: {
                exclude: ['password']
            }
        });
        if(!findUser){
            return res.status(200).json(response.nodeFound(`userid ${userId} Not Found!`));
        }
        res.status(200).json(response.ok(findUser, message.inquiry));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
};


exports.addUser = async (req, res) => {
    try {
        const { username, password, nama, nomor_telpon, alamat, jenis_kelamin, tempat_lahir, tanggal_lahir, email, level } = req.body;
        const hashPassword = await bcrypt.hash(password, 12);
        const saveUser = await User.create({
            username,
            password: hashPassword,
            nama,
            nomor_telpon,
            alamat,
            jenis_kelamin,
            tempat_lahir,
            tanggal_lahir,
            email,
            level
        });
        res.status(201).json(response.create(saveUser, message.create));
    } catch (err) {
        res.status(200).json(response.bad(err.errors[0].message));
    }
}

exports.updateUser = async (req, res) => {
    try {
        const {nama, nomor_telpon, alamat, jenis_kelamin, tempat_lahir, tanggal_lahir, email, level } = req.body;
        const id = req.params.id;
        const findUser = await User.findByPk(id);
        if(!findUser){
            return res.status(200).json(response.nodeFound(`User Id ${id} Not Found!`));
        }
        findUser.nama = nama ? nama : findUser.nama;
        findUser.nomor_telpon = nomor_telpon ? nomor_telpon : findUser.nomor_telpon;
        findUser.alamat = alamat ? alamat : findUser.alamat;
        findUser.jenis_kelamin = jenis_kelamin ? jenis_kelamin : findUser.jenis_kelamin;
        findUser.tempat_lahir = tempat_lahir ? tempat_lahir : findUser.tempat_lahir;
        findUser.tanggal_lahir = tanggal_lahir ? tanggal_lahir : findUser.tanggal_lahir;
        findUser.email = email ? email : findUser.email;
        findUser.level = level ? level : findUser.level;
        await findUser.save();
        const getUser = await User.findOne({
            where: {id},
            attributes: ['nama', 'nomor_telpon', 'alamat', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir', 'email', 'level']
        });
        res.status(200).json(response.update(getUser,'Update Success!'));
    } catch (err) {
        res.status(200).json(response.bad(err.errors[0].message));
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const findUser = await User.findByPk(id);
        if (!findUser) {
            res.status(200).json(response.nodeFound('User Not Found!'));
        }
        const deleteUser = await findUser.destroy();
        if (deleteUser) {
            res.status(200).json(response.okDelete(`User ${findUser.nama} Success Deleted!`));
        }
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}
