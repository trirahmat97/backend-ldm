const request = require('supertest');
const app = require('../server');
const User = require('../models/user');
const bcrypt = require('bcryptjs');

const userOne = {
    username: 'testing2',
    password: '1234',
    nama: 'user Testing2',
    nomor_telpon: '089877889988',
    alamat: 'Padang Cermin',
    jenis_kelamin: 'L',
    tempat_lahir: 'Lampung',
    tanggal_lahir: '1997-03-26',
    email: 'testing2@gmail.com',
    level: 'Admin'
}

let auth = {}

beforeEach(async () => {
    await User.destroy({where: {}});
    const password = await bcrypt.hash(userOne.password, 12);
    const payload = {...userOne, password};
    await User.create(payload);
    const response = await request(app).post('/api/user/login').send({
        username: userOne.username,
        password: userOne.password
    });
    auth = response.body.values;
})

test('Should create new user', async () => {
    await request(app).post('/api/user').send({
        username: 'testing',
        password: '1234',
        nama: 'user Testing',
        nomor_telpon: '089877889988',
        alamat: 'Padang Cermin',
        jenis_kelamin: 'L',
        tempat_lahir: 'Lampung',
        tanggal_lahir: '1997-03-26',
        email: 'testing@gmail.com',
        level: 'Admin'
    }).expect(201)
})

test('Testing user login', async () => {
    const response = await request(app).post('/api/user/login').send({
        username: userOne.username,
        password: userOne.password
    });
    expect(response.body.resCode).toBe("200");
})

test('Testing loging failed!', async () => {
    const response = await request(app).post('/api/user/login').send({
        username: userOne.username,
        password: 'testpassword'
    });
    expect(response.body.resCode).toBe("400");
})


test('Testing get users with auth', async () => {
    const response = await request(app).get('/api/user').set('Authorization', `Bearer ${auth.access_token}`).send();
    expect(response.body.resCode).toBe("200");
});

test('Testing get users not with auth', async () => {
    const response = await request(app).get('/api/user').send();
    expect(response.body.resCode).toBe("401");
});