exports.ok = (values, message) => {
    return {
        resCode: '200',
        resDesc: message,
        values
    }
};

exports.fetchById = (value, message) => {
    return {
        resCode: '200',
        resDesc: message,
        value
    }
};

exports.okDelete = (message) => {
    return {
        resCode: '200',
        resDesc: message,
    }
};

exports.create = (value, message) => {
    return {
        resCode: '201',
        resDesc: message,
        value
    }
}

exports.update = (value, message) => {
    return {
        resCode: '204',
        resDesc: message,
        value
    }
}

exports.bad = (message) => {
    return {
        resCode: '400',
        resDesc: message
    }
}

exports.nodeFound = (message) => {
    return {
        resCode: '404',
        resDesc: message
    }
}