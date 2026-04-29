# Mortgage API

## Setup

Create a `.env` file with database connection settings:

```
DB_USER=postgres
DB_HOST=localhost
DB_NAME=mortgage
DB_PASSWORD=postgres
DB_PORT=5432
PORT=3000
```

Run migrations manually (example):

```
node -e "require('./src/db/migration').runMigrations()"
```

## Run

```
npm install
npm start
```

## Endpoints

### POST /mortgage-profiles

Request body:

```
{
  "propertyPrice": 5000000,
  "propertyType": "apartment_in_new_building",
  "downPaymentAmount": 1000000,
  "matCapitalAmount": 500000,
  "matCapitalIncluded": true,
  "mortgageTermYears": 20,
  "interestRate": 12.5
}
```

Response:

```
{ "id": "1" }
```

### GET /mortgage-profiles/:id

Response:

```
{
  "monthlyPayment": "12345.67",
  "totalPayment": "1234567.89",
  "totalOverpaymentAmount": "234567.89",
  "possibleTaxDeduction": "65000.00",
  "savingsDueMotherCapital": "500000.00",
  "recommendedIncome": "30864.18",
  "mortgagePaymentSchedule": {}
}
```
