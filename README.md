## Description

This little example emulates a transaction service. It works as so that a client submits a requests containing their id. If client is not registered we create a new client, with no fixed transaction commission. We then start to register transactions commited by that client, calculating transaction commissions accordingly.

## Installation
### Initial requirements
- Nodejs v14.4.0 (Other versions are not tested)
- Docker (for postgres setup)

### Run the following and you should be good to go
```bash
$ npm install
$ npm run start:db # this will start postgres on port 5433
$ cat .env-sample > .env
```
If you would like to make any adjustments to the db-setup, such as port etc change the constants in start-db.sh at root. 

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Seed some data
```bash
  $ docker exec -it code-test psql -U postgres
  postgres=\# \c tx_commissions
  tx_commissions=\# insert into clients (client_id, fixed_price) values(42, 0.05); # seeding a client with fixed price into db
```

### Test that is working like 
```bash
  $ curl --location --request POST 'localhost:3000/transactions' \
    --header 'Content-Type: application/json' \
    --data-raw '{
      "date": "2021-03-03",
      "amount": "100.00",
      "currency": "EUR",
      "client_id": 42
  }'
```

## Test

### Note
  The app has to be started ones, for the db-migrations to happen, before running the e2e tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## Some additional notes
If you run the e2e tests this will clean the db of any records. Just repeat the seed under installation and you are good to again.
