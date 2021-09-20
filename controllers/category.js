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

exports.getCategory = async (req, res) => {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page-1, size);
    try {
        const category = await Category.findAndCountAll({
            limit, offset, distinct: true,
            where: { parent_id: null },
            attributes: {
                exclude: ['parent_id']
            },
            include: [{
                model: Category,
                as: 'items',
            }],
            order: [
                ['id', 'DESC']
            ],
        });
        const responseCategory = getPagingData(category, page-1, limit);
        res.status(200).json(response.ok(responseCategory, message.fetch));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.getAllCategory = async (req, res) => {
    try {
        const category = await Category.findAll();
        res.status(200).json(response.ok(category, message.fetch));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.createCategory = async (req, res) => {
    try {
        const { name, description, parent_id, label, icon } = req.body;
        const category = await Category.create({
            name,
            description: description ? description : null,
            parent_id: parent_id ? parent_id : null,
            icon: icon ? icon : null,
            label: label ? label : null
        });
        res.status(200).json(response.create(category, 'Category ' + message.create));
    } catch (err) {
        const error = err.errors[0].message;
        res.status(200).json(response.bad(error ? error : err.message));
    }
}

exports.editCategory = async (req, res) => {
    let parentId;
    try {
        const id = req.params.id;
        const {name, description, parent_id, label, icon } = req.body;
        const findCategory = await Category.findByPk(id);
        if (!parent_id) {
            parentId = findCategory.parent_id;
        } else if (parent_id === '0') {
            parentId = null;
        } else {
            parentId = parent_id;
        }
        if(parentId == findCategory.id){
            return res.status(200).json(response.bad('Parent ID Invalid!'));
        }
        if (!findCategory) {
            return res.status(200).json(response.nodeFound('Category ' + message.notfound));
        }
        console.log(parentId);
        console.log(findCategory.id);
        const updateCategory = await findCategory.update({
            name: name ? name : findCategory.name,
            description: description ? description : findCategory.description,
            parent_id: parentId,
            icon: icon ? icon : findCategory.icon,
            label: label ? label : findCategory.label
        });
        res.status(200).json(response.update(updateCategory, 'Category ' + message.create));
    } catch (err) {
        const error = err.errors[0].message;
        res.status(200).json(response.bad(error ? error : err.message));
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const findCategory = await Category.findByPk(id);
        if (!findCategory) {
            return res.status(200).json(response.nodeFound('Category ' + message.notfound));
        }
        if (findCategory.pathIcon) {
            await fileDelete.deleteFile(findCategory.pathIcon);
        }
        await findCategory.destroy();
        res.status(200).json(response.okDelete('Category ' + findCategory.name + ' ' + message.delete));
    } catch (err) {
        res.status(200).json(response.bad(err.message));
    }
}

exports.getAllCategoryParent = async (req, res) => {
    try{
        const category = await Category.findAll({
            where: {parent_id: null}
        });
        res.status(200).json(response.ok(category, message.fetch));
    }catch(err){
        res.status(200).json(response.bad(err.message));
    }
}