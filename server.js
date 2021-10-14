const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

// const config = require('./utils/config');
// const connection = require('./db/connection');


const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//config upload
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, Date.now() + '-' + name);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

app.use(multer({
    storage: fileStorage,
    fileFilter: fileFilter
}).single('image'));

//load routing
const UserRouting = require('./routes/user');
const JobRouting = require('./routes/job');
const ProdukRouting = require('./routes/product');
const KategoriRouting = require('./routes/category');

//routing-url
app.use('/api/user/', UserRouting);
app.use('/api/job/', JobRouting);
app.use('/api/kategori/', KategoriRouting);
app.use('/api/produk/', ProdukRouting);

app.use('/images', express.static(path.join("images")));

module.exports = app;
