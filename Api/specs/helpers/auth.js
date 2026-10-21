const supertest = require('supertest');
const app = require('../../app');
const seed = require('../../db/seed');

module.exports.login = async () => {
  await seed();
  const res = await supertest(app).post('/auth/login').send({ email: 'test@meblabs.com', password: 'testtest' });
  return { Authorization: `Bearer ${res.body.token}` };
};
