#!/bin/bash
# Script to fix all failing tests with proper MongoDB mocking

cat > standardized-mongodb-mock.js << 'EOF'
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING = 'mongodb://mocked-connection-string';

// Create mock objects
const mockCollection = {
  insertOne: vi.fn().mockResolvedValue({ acknowledged: true, insertedId: 'mock-id' }),
  insertMany: vi.fn().mockResolvedValue({ acknowledged: true, insertedCount: 2, insertedIds: ['mock-id-1', 'mock-id-2'] }),
  findOne: vi.fn().mockResolvedValue({ _id: 'mock-id', name: 'Mock Product' }),
  find: vi.fn(() => ({
    toArray: vi.fn().mockResolvedValue([{ _id: 'mock-id-1', name: 'Product 1' }])
  })),
  updateOne: vi.fn().mockResolvedValue({ acknowledged: true, matchedCount: 1, modifiedCount: 1 }),
  updateMany: vi.fn().mockResolvedValue({ acknowledged: true, matchedCount: 2, modifiedCount: 2 }),
  deleteOne: vi.fn().mockResolvedValue({ acknowledged: true, deletedCount: 1 }),
  deleteMany: vi.fn().mockResolvedValue({ acknowledged: true, deletedCount: 2 }),
  replaceOne: vi.fn().mockResolvedValue({ acknowledged: true, matchedCount: 1, modifiedCount: 1 }),
  bulkWrite: vi.fn().mockResolvedValue({ acknowledged: true, insertedCount: 1, matchedCount: 1, modifiedCount: 1, deletedCount: 0 }),
  countDocuments: vi.fn().mockResolvedValue(42),
  createIndex: vi.fn().mockResolvedValue('mock-index-name'),
  indexes: vi.fn().mockResolvedValue([{ v: 1, key: { _id: 1 }, name: '_id_' }]),
  drop: vi.fn().mockResolvedValue(true),
  aggregate: vi.fn(() => ({
    toArray: vi.fn().mockResolvedValue([{ _id: 'category1', count: 5 }])
  })),
  get collectionName() { return 'products'; }
};

const mockAdmin = {
  serverInfo: vi.fn().mockResolvedValue({ version: '4.0.0', ok: 1 }),
  serverStatus: vi.fn().mockResolvedValue({ ok: 1, uptime: 12345 }),
  listDatabases: vi.fn().mockResolvedValue({
    databases: [{ name: 'adventureworks' }, { name: 'testdb' }]
  })
};

const mockDatabase = {
  collection: vi.fn(() => mockCollection),
  admin: vi.fn(() => mockAdmin),
  dropDatabase: vi.fn().mockResolvedValue(true),
  listCollections: vi.fn(() => ({
    async *[Symbol.asyncIterator]() {
      yield { name: 'products' };
      yield { name: 'customers' };
    },
    toArray: vi.fn().mockResolvedValue([{ name: 'products' }, { name: 'customers' }])
  })),
  get databaseName() { return 'adventureworks'; }
};

const mockClient = {
  connect: vi.fn().mockResolvedValue(undefined),
  close: vi.fn().mockResolvedValue(undefined),
  db: vi.fn(() => mockDatabase),
  get readPreference() { return { mode: 'primary' }; }
};

// Mock the entire mongodb module
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => mockClient)
}));
EOF

# Fix the 202-get-doc-count test specifically
cat > 202-get-doc-count.test.js << 'EOF'
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING = 'mongodb://mocked-connection-string';

// Create mock objects
const mockCollection = {
  insertOne: vi.fn(),
  insertMany: vi.fn(),
  findOne: vi.fn(),
  find: vi.fn(),
  updateOne: vi.fn(),
  updateMany: vi.fn(),
  deleteOne: vi.fn(),
  deleteMany: vi.fn(),
  replaceOne: vi.fn(),
  bulkWrite: vi.fn(),
  countDocuments: vi.fn().mockResolvedValue(42),
  createIndex: vi.fn(),
  indexes: vi.fn(),
  drop: vi.fn(),
  aggregate: vi.fn(),
  get collectionName() { return 'products'; }
};

const mockAdmin = {
  serverInfo: vi.fn(),
  serverStatus: vi.fn(),
  listDatabases: vi.fn().mockResolvedValue({
    databases: [{ name: 'adventureworks' }, { name: 'testdb' }]
  })
};

const mockDatabase = {
  collection: vi.fn(() => mockCollection),
  admin: vi.fn(() => mockAdmin),
  dropDatabase: vi.fn(),
  listCollections: vi.fn(() => ({
    async *[Symbol.asyncIterator]() {
      yield { name: 'products' };
      yield { name: 'customers' };
    },
    toArray: vi.fn().mockResolvedValue([{ name: 'products' }, { name: 'customers' }])
  })),
  get databaseName() { return 'adventureworks'; }
};

const mockClient = {
  connect: vi.fn(),
  close: vi.fn(),
  db: vi.fn(() => mockDatabase),
  get readPreference() { return { mode: 'primary' }; }
};

// Mock the entire mongodb module
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => mockClient)
}));

describe('Get Document Count Sample', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute main function successfully', async () => {
    // Import the main function
    const { main } = await import('../202-get-doc-count/index.js');

    // Execute the main function
    await expect(main()).resolves.not.toThrow();
  });
});
EOF

echo "Fixed 202-get-doc-count.test.js"
