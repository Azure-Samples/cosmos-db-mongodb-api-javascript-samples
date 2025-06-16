import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.COSMOS_CONNECTION_STRING =
  'mongodb://mocked-connection-string';

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
  get collectionName() {
    return 'products';
  },
};

const mockAdmin = {
  serverInfo: vi.fn(),
  serverStatus: vi.fn(),
  listDatabases: vi.fn().mockResolvedValue({
    databases: [{ name: 'adventureworks' }, { name: 'testdb' }],
  }),
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
    toArray: vi
      .fn()
      .mockResolvedValue([{ name: 'products' }, { name: 'customers' }]),
  })),
  get databaseName() {
    return 'adventureworks';
  },
};

const mockClient = {
  connect: vi.fn(),
  close: vi.fn(),
  db: vi.fn(() => mockDatabase),
  get readPreference() {
    return { mode: 'primary' };
  },
};

// Mock the entire mongodb module
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => mockClient),
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
