# Coffee Blockchain API

## Purpose

This project is a coffee-shipment ledger backed by a classic blockchain. Each coffee movement is recorded as a transaction, grouped into blocks, and protected with proof-of-work hashing so earlier shipments are harder to rewrite.

The Express API lets you inspect the chain, queue new movements, and mine pending transactions into blocks.

## Data model

### Transaction

A transaction records one coffee movement:

```js
{ sender, recipient, batchId, weightKg }
```

### Block

A block stores mined transactions and proof-of-work metadata:

```js
{ index, timestamp, transactions, previousHash, nonce, hash }
```

Block hashes are calculated from `index + previousHash + JSON.stringify(transactions) + nonce`.

### Blockchain

The `Blockchain` class keeps:

- `chain` — completed blocks, starting with a deterministic genesis block at index `0`
- `pendingTransactions` — movements waiting to be mined

Mining runs a proof-of-work loop that increments `nonce` until the block hash meets the required difficulty.

## Installation

```bash
git clone https://github.com/silvergin7/coffee-blockchain-api.git
cd coffee-blockchain-api
npm install
```

## Running the server

```bash
npm start
```

The server listens on `process.env.PORT`, or port `3000` if `PORT` is not set.

## API

### GET /blockchain

Returns the full chain as a JSON array.

**Response: `200 OK`**

```json
[
  {
    "index": 0,
    "timestamp": 0,
    "transactions": [],
    "previousHash": "0",
    "nonce": 0,
    "hash": "66c1f978d80ce2da318e5c65283d0668fd5dfe593644ae9fd7496bd2f91be72b"
  }
]
```

After mining, the array includes additional blocks.

### POST /transactions

Adds a valid transaction to `pendingTransactions`.

**Request body**

```json
{
  "sender": "farmA",
  "recipient": "roasterB",
  "batchId": "batch1",
  "weightKg": 50
}
```

**Response: `201 Created`**

```json
{
  "sender": "farmA",
  "recipient": "roasterB",
  "batchId": "batch1",
  "weightKg": 50
}
```

### POST /mine

Mines all pending transactions into a new block, appends it to the chain, clears the pending pool, and returns the mined block.

No request body is required.

**Response: `201 Created`**

```json
{
  "index": 1,
  "timestamp": 1786790147620,
  "transactions": [
    {
      "sender": "farmA",
      "recipient": "roasterB",
      "batchId": "batch1",
      "weightKg": 50
    }
  ],
  "previousHash": "66c1f978d80ce2da318e5c65283d0668fd5dfe593644ae9fd7496bd2f91be72b",
  "nonce": 3022,
  "hash": "000dd070a14a0263f30cacb0f120d156dacb119ea33d5558dd26c10cc64678b4"
}
```

This block is from an example run. The timestamp, nonce, and hash will differ when the API is run again.

### Validation errors

`POST /transactions` uses Express middleware to reject invalid requests before they reach the route handler.

**Example: missing `batchId`**

Request:

```json
{
  "sender": "farm",
  "recipient": "roaster",
  "weightKg": 50
}
```

Response: `400 Bad Request`

```json
{
  "error": "batchId is required"
}
```

The same pattern applies when `sender`, `recipient`, or `weightKg` is missing.

## Testing

### Run tests

```bash
npm test
```

The suite uses Vitest for unit tests and Supertest for Express integration tests.

### Coverage

```bash
npx vitest run --coverage
```

Current result:

| Metric     | Coverage |
|------------|----------|
| Statements | 98%      |
| Branches   | 100%     |
| Functions  | 100%     |
| Lines      | 98%      |

## TDD workflow

Core blockchain behavior and API validation were developed test-first.
Validation is implemented as Express middleware, separate from the
`Blockchain` domain class.

### Red → green: hash calculation and mining

Core blockchain behavior was also developed test-first.

#### Calculate block hashes

- Red: [Test: red - calculate hash](https://github.com/silvergin7/coffee-blockchain-api/commit/74e96a2)
- Green: [Feat: green - calculate hash](https://github.com/silvergin7/coffee-blockchain-api/commit/68b34b4)

#### Mine blocks

- Red: [Test: red - mine block](https://github.com/silvergin7/coffee-blockchain-api/commit/9f96d6b)
- Green: [Feat: green - mine block](https://github.com/silvergin7/coffee-blockchain-api/commit/2cfddef)

### Red → green: validate batchId

Integration test for a transaction missing `batchId` → `400`, with an empty pending pool.

- Red: https://github.com/silvergin7/coffee-blockchain-api/commit/811a81d
- Green: https://github.com/silvergin7/coffee-blockchain-api/commit/f6abcd1

### Red → green: validate transaction fields (sender, recipient, weightKg)

Parameterized integration tests for transactions missing one required field at a time → `400`, with an empty pending pool.

- Red: https://github.com/silvergin7/coffee-blockchain-api/commit/fd9def0
- Green: https://github.com/silvergin7/coffee-blockchain-api/commit/883dffc

### Additional regression coverage: empty transaction request

This test was green on introduction. It verifies that a `POST /transactions` request sent with no payload is rejected with `400` and does not add a pending transaction.

- Commit: https://github.com/silvergin7/coffee-blockchain-api/commit/a96f4cc

## Repository

https://github.com/silvergin7/coffee-blockchain-api
