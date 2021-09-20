const fs = require('fs');
const url = require('url');

const deleteFile = (filePath) => {
    const file = url.parse(filePath, true);
    fs.unlink(file.path, (err) => {
        if (err) {
            throw err;
        }
    });
}

exports.deleteFile = deleteFile;