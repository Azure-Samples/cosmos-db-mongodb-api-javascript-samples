import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017';

// Mock the entire mongodb module FIRST
vi.mock('mongodb', () => ({
  MongoClient: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    db: vi.fn(() => ({
      collection: vi.fn(() => ({
        insertOne: vi.fn(),
        insertMany: vi.fn(),
        findOne: vi.fn(),
        find: vi.fn(() => ({
          toArray: vi.fn().mockResolvedValue([
            { _id: '1', name: 'Product 1', price: 10.99 },
            { _id: '2', name: 'Product 2', price: 15.99 }
          ])
        })),
        updateOne: vi.fn(),
        deleteOne: vi.fn(),
        deleteMany: vi.fn(),
        createIndex: vi.fn(),
        getIndexes: vi.fn().mockResolvedValue([]),
        bulkWrite: vi.fn(),
        countDocuments: vi.fn().mockResolvedValue(2),
        get collectionName() {
          return 'products';
        },
      })),
      admin: vi.fn(() => ({
        serverInfo: vi.fn(),
        serverStatus: vi.fn(),
        listDatabases: vi.fn().mockResolvedValue({
          databases: [
            { name: 'adventureworks' },
            { name: 'testdb' }
          ]
        }),
      })),
      dropDatabase: vi.fn().mockResolvedValue(true),
      dropCollection: vi.fn().mockResolvedValue(true),
      listCollections: vi.fn(() => {
        const mockCollections = [
          { name: 'products' },
          { name: 'customers' }
        ];
        return {
          [Symbol.asyncIterator]: async function* () {
            for (const collection of mockCollections) {
              yield collection;
            }
          },
          toArray: vi.fn().mockResolvedValue(mockCollections)
        };
      }),
      get databaseName() {
        return 'adventureworks';
      },
    })),
    options: {
      host: 'mocked-host',
      port: 27017,
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    get readPreference() {
      return { mode: 'primary' };
    },
  })),
  ObjectId: vi.fn().mockImplementation(id => ({
    toString: () => id || '507f1f77bcf86cd799439011',
    toHexString: () => id || '507f1f77bcf86cd799439011'
  }))
}));

describe('275-find Sample', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should execute main function successfully', async () => {
    // Import the main function
    const { main } = await import('../275-find/index.js');

    // Execute the main function
    await expect(main()).resolves.not.toThrow();
  });
});
