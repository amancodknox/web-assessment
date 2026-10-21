const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const db = require('../db/connect-test');
const { login } = require('./helpers/auth');

const agent = supertest(app);
let auth;

const expense = { type: 'expense', amount: 250.5, category: 'Food', date: '2026-10-01', description: 'Lunch with team' };
const income = { type: 'income', amount: 5000, category: 'Salary', date: '2026-10-05', description: 'October salary' };

const create = body => agent.post('/transactions').set(auth).send(body);

beforeAll(() => db.connect());
beforeEach(async () => {
  await db.clear();
  auth = await login();
});
afterAll(() => db.close());

describe('POST /transactions', () => {
  test('creates a transaction', async () => {
    const res = await create(expense).expect(201);
    expect(res.body).toEqual(
      expect.objectContaining({ _id: expect.any(String), type: 'expense', amount: 250.5, category: 'Food' })
    );
  });

  test.each([
    ['negative amount', { ...expense, amount: -10 }],
    ['zero amount', { ...expense, amount: 0 }],
    ['more than 2 decimals', { ...expense, amount: 10.123 }],
    ['invalid type', { ...expense, type: 'loan' }],
    ['invalid date', { ...expense, date: 'not-a-date' }],
    ['missing fields', { type: 'expense', amount: 10 }],
    ['unknown field', { ...expense, foo: 'bar' }]
  ])('rejects %s', async (_, body) => {
    const res = await create(body).expect(400);
    expect(res.body.error).toBe('VALIDATION_ERROR');
  });

  test('rejects a category that does not match the type', async () => {
    await create({ ...expense, category: 'Salary' }).expect(400);
  });

  test('requires authentication', async () => {
    await agent.post('/transactions').send(expense).expect(401);
  });
});

describe('GET /transactions', () => {
  beforeEach(async () => {
    await create(expense);
    await create(income);
    await create({ ...expense, amount: 40, category: 'Transport', date: '2026-10-10', description: 'Cab' });
  });

  test('lists transactions newest first by default', async () => {
    const res = await agent.get('/transactions').set(auth).expect(200);
    expect(res.body).toHaveLength(3);
    const dates = res.body.map(t => t.date);
    expect(dates).toEqual([...dates].sort().reverse());
  });

  test('filters by type and category', async () => {
    const byType = await agent.get('/transactions').query({ type: 'expense' }).set(auth).expect(200);
    expect(byType.body).toHaveLength(2);

    const byCategory = await agent.get('/transactions').query({ category: 'Salary' }).set(auth).expect(200);
    expect(byCategory.body).toHaveLength(1);
  });

  test('searches the description', async () => {
    const res = await agent.get('/transactions').query({ search: 'lunch' }).set(auth).expect(200);
    expect(res.body).toHaveLength(1);
  });

  test('sorts by amount ascending', async () => {
    const res = await agent.get('/transactions').query({ sortBy: 'amount', sortOrder: 'asc' }).set(auth).expect(200);
    expect(res.body.map(t => t.amount)).toEqual([40, 250.5, 5000]);
  });

  test('rejects an unknown sort field', async () => {
    await agent.get('/transactions').query({ sortBy: 'password' }).set(auth).expect(400);
  });

  test('does not return other users transactions', async () => {
    const other = await new User({ email: 'other@meblabs.com', password: 'testtest' }).save();
    await new Transaction({ ...expense, user: other._id }).save();

    const res = await agent.get('/transactions').set(auth).expect(200);
    expect(res.body).toHaveLength(3);
  });
});

describe('GET /transactions/categories', () => {
  test('returns categories grouped by type', async () => {
    const res = await agent.get('/transactions/categories').set(auth).expect(200);
    expect(res.body.income).toContain('Salary');
    expect(res.body.expense).toContain('Food');
  });
});

describe('GET, PUT, DELETE /transactions/:id', () => {
  let id;
  beforeEach(async () => {
    id = (await create(expense)).body._id;
  });

  test('gets a transaction', async () => {
    const res = await agent.get(`/transactions/${id}`).set(auth).expect(200);
    expect(res.body._id).toBe(id);
  });

  test('updates a transaction', async () => {
    const res = await agent.put(`/transactions/${id}`).set(auth).send({ amount: 300, description: 'Dinner' }).expect(200);
    expect(res.body).toEqual(expect.objectContaining({ amount: 300, description: 'Dinner', category: 'Food' }));
  });

  test('rejects switching type without a matching category', async () => {
    await agent.put(`/transactions/${id}`).set(auth).send({ type: 'income' }).expect(400);
  });

  test('rejects an empty update', async () => {
    await agent.put(`/transactions/${id}`).set(auth).send({}).expect(400);
  });

  test('deletes a transaction', async () => {
    await agent.delete(`/transactions/${id}`).set(auth).expect(200);
    await agent.get(`/transactions/${id}`).set(auth).expect(404);
  });

  test('returns 404 for an unknown id and 400 for a malformed id', async () => {
    await agent.get(`/transactions/${new mongoose.Types.ObjectId()}`).set(auth).expect(404);
    await agent.get('/transactions/abc').set(auth).expect(400);
  });
});
