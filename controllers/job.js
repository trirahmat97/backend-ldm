const response = require('../utils/response');
const message = require('../utils/responseMessage');
const { Op } = require("sequelize");

const Job = require('../models/job');
const User = require('../models/user');
const Product = require('../models/product');
const UserJob = require('../models/userJob');
const ProductJob = require('../models/productJob');

const getPagination = (page, size) => {
    const limit = size ? +size : 10;
    const offset = page ? page * limit : 0;
    return { limit, offset };
  };

const getPagingData = (data, page, limit) => {
    const { count: totalItems, rows } = data;
    const currentPage = page ? ++page : 1;
    const totalPages = Math.ceil(totalItems / limit);
    const rows2 = rows.map(dat => {
        const progress = progressFunction(dat);
        return {
            id: dat.id,
            deskripsi: dat.deskripsi,
            alamat: dat.alamat,
            pic_gedung: dat.pic_gedung,
            no_telpon_pic: dat.no_telpon_pic,
            catatan: dat.catatan,
            detail: dat.detail,
            status_teknisi: dat.status_teknisi,
            status_supervisor: dat.status_supervisor,
            tanggal_pemasangan: dat.tanggal_pemasangan,
            file: dat.file,
            progress,
            users: dat.users,
            products: dat.products
        }
    })

    return { totalItems, rows:rows2, totalPages, currentPage };
};

const progressFunction = data => {
    // data {5} , users {5}, products {5}, progresst{20}, donet{40}, progressS{20}, doneS{35} / 7
    let progress = 5;
    if(data.users.length){
        progress+=5;
    }
    if(data.products.length){
        progress+=5;
    }
    if(data.status_teknisi === 'Pending'){
        progress+=5;
    }else if(data.status_teknisi === 'Progress'){
        progress+=20;
    }else if(data.status_teknisi === 'Done'){
        progress+=40;
    }
    if(data.status_supervisor === 'Pending'){
        return progress+=5;
    }else if(data.status_supervisor === 'Progress'){
        return progress+=20;
    }else if(data.status_supervisor === 'Done'){
        return progress+=45;
    }
    return progress;
}

exports.findAllJob = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page-1, size);
    try {
        const job = await Job.findAndCountAll({
            limit,
            offset,
            distinct: true,
            where: {},
            include: [
                {
                    model: User,
                    attributes: ['id', 'nama', 'nomor_telpon', 'email'],
                    through: { attributes: [] }
                },
                {
                    model: Product,
                    attributes: ['id', 'title'],
                    through: { attributes: ['lokasi_pemasangan', 'keterangan', 'jumlah'] }
                }
            ],
            order: [
                ['id', 'DESC']
            ],
        });
        const responseJob = getPagingData(job, page-1, limit);
        res.status(200).json(response.ok(responseJob, message.fetch));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
};

exports.findJobById = async (req, res) => {
    const id = req.params.id;
    try {
        const findJob = await Job.findOne({
            where: {id},
            include: [
                {
                    model: User,
                    attributes: ['id', 'nama','nomor_telpon', 'email'],
                    through: { attributes: [] }
                },
                {
                    model: Product,
                    attributes: ['id', 'title',],
                    through: { attributes: ['lokasi_pemasangan', 'keterangan', 'jumlah'] }
                }
            ],
        });
        if(!findJob){
            return res.status(404).json(response.nodeFound(`id ${id} Not Found!`));
        }
        res.status(200).json(response.ok(findJob, message.inquiry));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
};

exports.addJob = async (req, res) => {
    try {
        const { deskripsi, alamat, pic_gedung, no_telpon_pic, catatan, detail, status_teknisi, status_supervisor, tanggal_pemasangan } = req.body;
        const saveJob = await Job.create({
            deskripsi,
            alamat,
            pic_gedung,
            no_telpon_pic,
            catatan,
            detail,
            status_teknisi,
            status_supervisor,
            tanggal_pemasangan,
        });
        res.status(201).json(response.create(saveJob, message.create));
    } catch (err) {
        res.status(200).json(response.bad(err.errors[0].message));
    }
}

exports.updateJob = async (req, res) => {
    try {
        const { deskripsi, alamat, pic_gedung, no_telpon_pic, catatan, detail, status_teknisi, status_supervisor, tanggal_pemasangan } = req.body;
        const id = req.params.id;
        const findJob = await Job.findByPk(id);
        if(!findJob){
            return res.status(200).json(response.nodeFound(`Job Id ${id} Not Found!`));
        }
        findJob.deskripsi = deskripsi ? deskripsi : findJob.deskripsi;
        findJob.alamat = alamat ? alamat : findJob.alamat;
        findJob.pic_gedung = pic_gedung ? pic_gedung : findJob.pic_gedung;
        findJob.no_telpon_pic = no_telpon_pic ? no_telpon_pic : findJob.no_telpon_pic;
        findJob.catatan = catatan ? catatan : findJob.catatan;
        findJob.detail = detail ? detail : findJob.detail;
        findJob.status_teknisi = status_teknisi ? status_teknisi : findJob.status_teknisi;
        findJob.status_supervisor = status_supervisor ? status_supervisor : findJob.status_supervisor;
        findJob.tanggal_pemasangan = tanggal_pemasangan ? tanggal_pemasangan : findJob.tanggal_pemasangan;
        await findJob.save();
        const getJob = await Job.findOne({
            where: {id},
            attributes: ['deskripsi', 'alamat', 'pic_gedung', 'no_telpon_pic', 'catatan', 'detail', 'status_teknisi', 'status_supervisor', 'tanggal_pemasangan']
        });
        res.status(200).json(response.update(getJob,'Update Success!'));
    } catch (err) {
        res.status(200).json(response.bad(err.errors[0].message));
    }   
}

exports.deleteJob = async (req, res) => {
    try {
        const id = req.params.id;
        const findJob = await Job.findByPk(id);
        if (!findJob) {
            res.status(200).json(response.nodeFound('Job Not Found!'));
        }
        const deleteJob = await findJob.destroy();
        if (deleteJob) {
            res.status(200).json(response.okDelete(message.delete));
        }
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.sendJob = async (req, res) =>{
    try{
        const { users, jobId } = req.body;
        const findJob = await Job.findByPk(jobId);
        if(!findJob){
            res.status(200).json(response.nodeFound('Job Not Found!'));
        }
        const findUsers = await User.findAll({ where: { id: { [Op.in]: users } } });
        if (findUsers.length > 0) {
            await findJob.addUser(findUsers);
        }
        const userJobResult = await Job.findOne({
            where: { id: findJob.id },
            include: [{
                model: User,
                attributes: ['nama', 'nomor_telpon', 'alamat', 'jenis_kelamin', 'email'],
                through: {
                  attributes: [],
                }
              }]
        });
        res.status(201).json(response.create(userJobResult, message.create));
    }
    catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.sendProduct = async (req, res) =>{
    try{
        const { products, jobId, jumlah, keterangan, lokasi_pemasangan } = req.body;
        const findJob = await Job.findByPk(jobId);
        if(!findJob){
            res.status(200).json(response.nodeFound('Job Not Found!'));
        }
        const findProduct = await Product.findAll({ where: { id: { [Op.in]: products } } });
        if (findProduct.length > 0) {
            await findJob.addProduct(findProduct, 
                { through: { 
                    jumlah, keterangan, lokasi_pemasangan
                } });
        }
        const productJobResult = await Job.findOne({
            where: { id: findJob.id },
            include: [{
                model: Product,
                attributes: ['id', 'title',],
                through: { attributes: ['lokasi_pemasangan', 'keterangan', 'jumlah'] }
              }]
        });
        res.status(201).json(response.create(productJobResult, message.create));
    }
    catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.findAllDetailJob = async (req, res) =>{
    try{
        const userJobResult = await Job.findAll({
            include: [{
                model: User,
                attributes: ['nama', 'nomor_telpon', 'alamat', 'jenis_kelamin', 'email'],
                through: {
                  attributes: [],
                }
              }]
        });
        res.status(200).json(response.ok(userJobResult, message.findAll));
    }
    catch (err) {
        res.status(400).json(response.bad(err.message));
    }
}

exports.findAllDetailJobById = async (req, res) =>{
    const id = req.params.id;
    try{
        const userJobResult = await Job.findOne({
            where: {id},
            include: [{
                model: User,
                attributes: ['nama', 'nomor_telpon', 'alamat', 'jenis_kelamin', 'email'],

                
                through: {
                  attributes: [],
                }
              }]
        });
        if(!userJobResult){
            return res.status(404).json(response.nodeFound(`id ${id} Not Found!`));
        }
        res.status(200).json(response.ok(userJobResult, message.inquiry));
    }
    catch (err) {
        res.status(400).json(response.bad(err.message));
    }
}

exports.addProducttoJob = async (req, res) =>{
    try{
        const { productId, jobId } = req.body;
        const findJob = await Job.findByPk(jobId);
        if(!findJob){
            res.status(404).json(response.nodeFound('Job Not Found!'));
        }
        for (let i = 0; i < productId.length; i++) {
            const findProduct = await Product.findByPk(productId[i]);
            if(findProduct){
                const findJobAndProduk = await JobProduct.findOne({where: {jobId: findJob.id,productId: findProduct.id}});
                if(findJobAndProduk == null){
                    await JobProduct.create({jobId: findJob.id, productId: findProduct.id});
                }
            }
        }
        const jobProductResult = await JobProduct.findAll({
            where: { jobId: findJob.id },
            include: [{
                model: Product
              }]
        });
        res.status(201).json(response.create(jobProductResult, message.create));
    }
    catch (err) {
            res.status(400).json(response.bad(err.errors[0].message));
    }
}

exports.deleteProducttoJob = async (req, res) => {
    try {
       const id = req.params.id
       const findjobProduct = await JobProduct.findByPk(id);
        if(!findjobProduct){
            res.status(200).json(response.nodeFound('Job Product Not Found!'));
        }
        const deleteProducttoJob = await findjobProduct.destroy();
        if (deleteProducttoJob) {
            res.status(200).json(response.okDelete(message.delete));
        }
    }
    catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.deleteUsertoJob = async (req, res) => {
    try {
       const id = req.params.id
       const findjobUser = await UserJob.findOne({where: {userId : id}});
        if(!findjobUser){
            res.status(200).json(response.nodeFound('Job User Not Found!'));
        }
        const deleteUsertoJob = await findjobUser.destroy();
        if (deleteUsertoJob) {
            res.status(200).json(response.okDelete(message.delete));
        }
    }
    catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.deleteProductToJob2 = async (req, res) => {
    try {
       const id = req.params.id
       const findProductJob = await ProductJob.findOne({where: {productId : id}});
        if(!findProductJob){
            res.status(200).json(response.nodeFound('Job Product Not Found!'));
        }
        const deleteProducttoJob = await findProductJob.destroy();
        if (deleteProducttoJob) {
            res.status(200).json(response.okDelete(message.delete));
        }
    }
    catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}
