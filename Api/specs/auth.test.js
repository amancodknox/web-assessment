const supertest = require('supertest');
const app = require('../app');
const db = require('../db/connect-test');
const seed = require('../db/seed');
const { login } = require('./helpers/auth');

const agent = supertest(app);

beforeAll(() => db.connect());
beforeEach(() => db.clear());
afterAll(() => db.close());

describe('POST /auth/login', () => {
  test('returns a token for the seed user', async () => {
    await seed();
    const res = await agent.post('/auth/login').send({ email: 'test@meblabs.com', password: 'testtest' }).expect(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toEqual(expect.objectContaining({ email: 'test@meblabs.com' }));
  });

  test('rejects a wrong password', async () => {
    await seed();
    const res = await agent.post('/auth/login').send({ email: 'test@meblabs.com', password: 'wrong' }).expect(401);
    expect(res.body.error).toBe('UNAUTHORIZED');
  });

  test('rejects a missing email', async () => {
    const res = await agent.post('/auth/login').send({ password: 'testtest' }).expect(400);
    expect(res.body).toEqual(expect.objectContaining({ error: 'VALIDATION_ERROR', message: 'email is required' }));
  });
});

describe('GET /auth/me and POST /auth/logout', () => {
  test('returns the profile and invalidates the token on logout', async () => {
    const auth = await login();

    const me = await agent.get('/auth/me').set(auth).expect(200);
    expect(me.body.email).toBe('test@meblabs.com');

    await agent.post('/auth/logout').set(auth).expect(200);
    await agent.get('/auth/me').set(auth).expect(401);
  });

  test('rejects requests without a token', async () => {
    await agent.get('/auth/me').expect(401);
  });
});
