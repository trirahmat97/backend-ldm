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
            return res.status(200).json(response.nodeFound('User ' + message.notfound));
        }
        const category = await Category.findByPk(categoryId);
        if (!category) {
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

