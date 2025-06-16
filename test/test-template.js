import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017';

// Create mock objects
const mockCollection = {
  insertOne: vi.fn().mockResolvedValue({
    acknowledged: true,
    insertedId: 'mock-id-123'
  }),
  insertMany: vi.fn().mockResolvedValue({
    acknowledged: true,
    insertedCount: 2,
    insertedIds: ['mock-id-456', 'mock-id-789']
  }),
  findOne: vi.fn().mockResolvedValue({
    _id: 'mock-id-123',
    name: 'Mock Product'
  }),
  find: vi.fn(() => ({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'mock-id-1', name: 'Product 1' },
      { _id: 'mock-id-2', name: 'Product 2' }
    ])
  })),
  updateOne: vi.fn().mockResolvedValue({
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1
  }),
  updateMany: vi.fn().mockResolvedValue({
    acknowledged: true,
    matchedCount: 2,
    modifiedCount: 2
  }),
  deleteOne: vi.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1
  }),
  deleteMany: vi.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 5
  }),
  replaceOne: vi.fn().mockResolvedValue({
    acknowledged: true,
    matchedCount: 1,
    modifiedCount: 1
  }),
  bulkWrite: vi.fn().mockResolvedValue({
    acknowledged: true,
    insertedCount: 2,
    matchedCount: 1,
    modifiedCount: 1,
    deletedCount: 0
  }),
  countDocuments: vi.fn().mockResolvedValue(42),
  createIndex: vi.fn().mockResolvedValue('mock-index-name'),
  getIndexes: vi.fn().mockResolvedValue([
    { v: 1, key: { _id: 1 }, name: '_id_' },
    { v: 1, key: { name: 1 }, name: 'name_1' }
  ]),
  indexes: vi.fn().mockResolvedValue([
    { v: 1, key: { _id: 1 }, name: '_id_' },
    { v: 1, key: { name: 1 }, name: 'name_1' }
  ]),
  drop: vi.fn().mockResolvedValue(true),
  aggregate: vi.fn(() => ({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'category1', averagePrice: 100 },
      { _id: 'category2', averagePrice: 200 }
    ])
  })),
  get collectionName() {
    return 'products';
  },
};

const mockAdmin = {
  serverInfo: vi.fn().mockResolvedValue({
    version: '4.0.0',
    versionArray: [4, 0, 0, 0],
    bits: 64,
    maxBsonObjectSize: 16777216,
    ok: 1
  }),
  serverStatus: vi.fn().mockResolvedValue({
    ok: 1,
    uptime: 12345
  }),
  listDatabases: vi.fn().mockResolvedValue({
    databases: [
      { name: 'adventureworks' },
      { name: 'testdb' }
    ]
  }),
};

// Mock collections that can be used as async iterator
const mockCollections = [
  { name: 'products' },
  { name: 'customers' }
];

const mockDatabase = {
  collection: vi.fn(() => mockCollection),
  admin: vi.fn(() => mockAdmin),
  dropDatabase: vi.fn().mockResolvedValue(true),
  dropCollection: vi.fn().mockResolvedValue(true),
  listCollections: vi.fn(() => {
    // Return an object that can be used as async iterator
    const iterator = {
      [Symbol.asyncIterator]: async function* () {
        for (const collection of mockCollections) {
          yield collection;
        }
      },
      toArray: vi.fn().mockResolvedValue(mockCollections)
    };
    return iterator;
  }),
  get databaseName() {
    return 'adventureworks';
  },
};

const mockClient = {
  connect: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  db: vi.fn(() => mockDatabase),
  options: {
    host: 'mocked-host',
    port: 27017,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  get readPreference() {
    return { mode: 'primary' };
  },
};

// Mock the entire mongodb module
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => mockClient),
}));

describe('{{TEST_NAME}}', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute {{TEST_TYPE}} successfully', async () => {
    {{TEST_BODY}}
  });
});
