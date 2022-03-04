import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from './../src/app.module';
import {
  BadRequestException,
  INestApplication,
  InternalServerErrorException,
} from '@nestjs/common';
import { TransactionRepository } from '../src/transaction.module.ts/transaction.repository';
import { ExchangeRateService } from '../src/exchange-rates/exchange-rates.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let transactionRepository: TransactionRepository;
  const getEurRateMock = jest.fn();

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ExchangeRateService)
      .useValue({
        getEuroRate: getEurRateMock,
      })
      .compile();

    app = moduleFixture.createNestApplication();
    transactionRepository = moduleFixture.get(TransactionRepository);

    await app.init();
    await transactionRepository.clients.query('delete from clients');
    await transactionRepository.clients.query(
      'insert into clients (client_id, fixed_price) values (42, 0.05)',
    );
  });

  afterAll(async () => {
    await transactionRepository.transactions.query('delete from transactions');
    await transactionRepository.clients.query('delete from clients');

    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    await transactionRepository.transactions.query(`delete from transactions`);
  });

  describe('/transactions (POST)', () => {
    it('creates a transaction and uses fixed_price', async () => {
      const resp = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 42,
          amount: '100.00',
          currency: 'EUR',
          date: '2021-01-01',
        });

      const transaction = await transactionRepository.transactions.find({
        where: { client_id: 42 },
      });
      expect(transaction.length === 1).toBeTruthy();
      expect(resp.status).toEqual(201);
      expect(resp.body).toEqual({
        amount: '0.05',
        currency: 'EUR',
      });
    });

    it('uses highTurnoverDiscount for second transaction in same month', async () => {
      const resp1 = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 40,
          amount: '1000.00',
          currency: 'EUR',
          date: '2020-01-30',
        });

      const resp2 = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 40,
          amount: '1.00',
          currency: 'EUR',
          date: '2020-01-31',
        });

      const resp3 = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 40,
          amount: '1.00',
          currency: 'EUR',
          date: '2020-02-01',
        });

      expect(resp1.body).toEqual({
        amount: '5',
        currency: 'EUR',
      });

      expect(resp2.body).toEqual({
        amount: '0.03',
        currency: 'EUR',
      });

      expect(resp3.body).toEqual({
        amount: '0.05',
        currency: 'EUR',
      });
    });

    it('returns bad request if currency dosent exists', async () => {
      getEurRateMock.mockImplementationOnce(() => {
        throw new BadRequestException();
      });
      const resp = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 42,
          amount: '100.00',
          currency: 'WWW',
          date: '2020-01-01',
        });

      expect(resp.status).toEqual(400);
    });

    it('returns internalServerError if something goes wrong in external-api', async () => {
      getEurRateMock.mockImplementationOnce(() => {
        throw new InternalServerErrorException();
      });
      const resp = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 42,
          amount: '100.00',
          currency: 'USD',
          date: '2020-02-29',
        });

      expect(resp.status).toEqual(500);
    });

    it.each([
      '2011-01-021',
      '22011-02-01',
      '2300-01-02',
      '2020-02-30',
      '2021-02-29',
      '2021-04-31',
    ])(`given invalid date %s expect badrequest`, async (date) => {
      const resp = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 42,
          amount: '100.00',
          currency: 'EUR',
          date,
        });

      expect(resp.status).toEqual(400);
    });

    it('returns badRequest for invalid currency-format', async () => {
      const resp = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          client_id: 42,
          amount: '100.00',
          currency: 'EURU',
          date: '2011-01-02',
        });

      expect(resp.status).toEqual(400);
    });
  });
});
