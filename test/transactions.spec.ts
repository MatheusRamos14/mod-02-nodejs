import { expect, beforeAll, afterAll, describe, it, beforeEach } from 'vitest';
import request from 'supertest';
import { execSync } from 'node:child_process';

import { app } from '../src/app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

beforeEach(() => {
  execSync('npm run knex -- migrate:rollback --all');
  execSync('npm run knex -- migrate:latest');
});

describe('Transactions user operations', () => {
  it('Should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'Teste transação',
      amount: 5000,
      type: 'credit',
    });

    expect(response.statusCode).toBe(201);
  });

  it('Should be able to list transactions', async () => {
    const createUserTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Teste transação',
        amount: 5000,
        type: 'credit',
      })
      .expect(201);

    const cookies = createUserTransactionResponse.get('Set-Cookie');

    const listAllTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    expect(listAllTransactionsResponse.body).toEqual(
      expect.objectContaining({
        transactions: [
          expect.objectContaining({
            title: 'Teste transação',
            amount: 5000,
          }),
        ],
      })
    );
  });

  it('Should be able to get a specific transaction', async () => {
    const createUserTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Teste transação',
        amount: 5000,
        type: 'credit',
      })
      .expect(201);

    const cookies = createUserTransactionResponse.get('Set-Cookie');

    const listAllTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    const id = listAllTransactionsResponse.body.transactions[0].id;

    const searchByIdResponse = await request(app.server)
      .get(`/transactions/${id}`)
      .set('Cookie', cookies)
      .expect(200);

    expect(searchByIdResponse.body.transaction).toEqual(
      expect.objectContaining({
        title: 'Teste transação',
        amount: 5000,
      })
    );
  });

  it('Should be able to get user summary', async () => {
    const createUserTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'Teste transação',
        amount: 5000,
        type: 'credit',
      })
      .expect(201);

    const cookies = createUserTransactionResponse.get('Set-Cookie');

    await request(app.server)
      .post('/transactions')
      .send({
        title: 'Teste transação 2',
        amount: 3000,
        type: 'debit',
      })
      .set('Cookie', cookies)
      .expect(201);

    const summaryReponse = await request(app.server)
      .get('/transactions/summary')
      .set('Cookie', cookies)
      .expect(200);

    expect(summaryReponse.body.summary).toEqual({
      amount: 2000,
    });
  });
});
