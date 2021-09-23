const Product = require('../models/product');
const User = require('../models/user');
const Category = require('../models/category');

const response = require('../utils/response');
const message = require('../utils/responseMessage');
const fileDelete = require('../utils/deleteFile');

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

exports.fetchAll = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page-1, size);
    try {
        const products = await Product.findAndCountAll({
            limit, offset, distinct: true, include: [{
                model: Category,
                as: 'category',
                attributes: ['name']
            }]
        });
        const responseProduct = getPagingData(products, page-1, limit);
        res.status(200).json(response.ok(responseProduct, message.fetch));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.create = async (req, res) => {
    const file = req.file;
    try {
        const url = req.protocol + '://' + req.get('host');
        const { userId, title, price, weight, description, stock, categoryId } = req.body;
        const user = await User.findByPk(userId);
        if (!user) {
            if (file) {
                await fileDelete.deleteFile('images/' + file.filename);
            }
            return res.status(200).json(response.nodeFound('User ' + message.notfound));
        }
        const category = await Category.findByPk(categoryId);
        if (!category) {
            if (file) {
                await fileDelete.deleteFile('images/' + file.filename);
            }
            return res.status(200).json(response.nodeFound('Category ' + message.notfound));
        }
        const product = await Product.create({
            userId: user.id,
            categoryId: category.id,
            title,
            price,
            weight: weight ? weight : 0,
            description: description ? description : null,
            stock: stock ? stock : 0,
            totalIn: stock ? stock : 0,
            thumbnail: file ? url + '/images/' + file.filename : null,
            thumbnailPath: file ? 'images/' + file.filename : null
        });
        res.status(200).json(response.create(product, 'User ' + message.create));
    } catch (err) {
        if (file) {
            await fileDelete.deleteFile('images/' + file.filename);
        }
        res.status(200).json(response.bad(err.message));
    }
}

exports.update = async (req, res) => {
    const file = req.file;
    try {
        const url = req.protocol + '://' + req.get('host');
        const id = req.params.id;
        const { userId, title, price, weight, description, stock, categoryId } = req.body;
        const findProduct = await Product.findByPk(id);
        if (!findProduct) {
            if (file) {
                await fileDelete.deleteFile('images/' + file.filename);
            }
            return res.status(200).json(response.nodeFound('Product ' + message.notfound));
        }
        const user = await User.findByPk(userId);
        if (!user) {
            if (file) {
                await fileDelete.deleteFile('images/' + file.filename);
            }
            return res.status(200).json(response.nodeFound('User ' + message.notfound));
        }
        const category = await Category.findByPk(categoryId);
        if (!category) {
            if (file) {
                await fileDelete.deleteFile('images/' + file.filename);
            }
            return res.status(200).json(response.nodeFound('Category ' + message.notfound));
        }
        if (file) {
            await fileDelete.deleteFile(findProduct.thumbnailPath);
        }
        //perhitungan stock
        let stockResult = 0;
        if(stock === findProduct.stock){
            stockResult = stock;
        }if(stock > findProduct.stock){
            const result =  stock - findProduct.stock;
            stockResult = findProduct.totalIn + result;
        }else{
            const result =  findProduct.stock - stock;
            stockResult = findProduct.totalIn - result;
        }
        const updateProduct = await findProduct.update({
            userId: userId ? userId : findProduct.userId,
            categoryId: categoryId ? categoryId : findProduct.categoryId,
            title: title ? title : findProduct.title,
            price: price ? price : findProduct.price,
            weight: weight ? weight : findProduct.price,
            description: description ? description : findProduct.description,
            stock: stock ? stock : findProduct.stock,
            totalIn: stockResult,
            thumbnail: file ? url + '/images/' + file.filename : null,
            thumbnailPath: file ? 'images/' + file.filename : null
        });
        res.status(200).json(response.update(updateProduct, 'User ' + message.update));
    } catch (err) {
        if (file) {
            await fileDelete.deleteFile('images/' + file.filename);
        }
        res.status(200).json(response.bad(err.message));
    }
}

exports.deleteProduct = async(req, res) => {
    try{
        const id = req.params.id;
        const findProduct = await Product.findByPk(id);
        if (!findProduct) {
            return res.status(200).json(response.nodeFound('Product ' + message.notfound));
        }
        if (findProduct.thumbnailPath) {
            await fileDelete.deleteFile(findProduct.thumbnailPath);
        }
        await findProduct.destroy();
        res.status(200).json(response.okDelete('Product ' + findProduct.title + ' ' + message.delete));
    }catch(err){
        res.status(200).json(response.bad(err.message));
    }
}

