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
  countDocuments: vi.fn(),
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
  listDatabases: vi.fn(),
};

const mockDatabase = {
  collection: vi.fn(() => mockCollection),
  admin: vi.fn(() => mockAdmin),
  dropDatabase: vi.fn(),
  listCollections: vi.fn(),
  get databaseName() {
    return 'adventureworks';
  },
};

const mockClient = {
  connect: vi.fn(),
  close: vi.fn(),
  db: vi.fn(() => mockDatabase),
};

// Mock MongoDB module
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => mockClient),
  ObjectId: vi.fn(id => ({ _id: id || 'mocked-object-id' })),
}));

describe('203-insert-doc', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock return values
    mockCollection.find.mockReturnValue({
      toArray: vi.fn(),
      limit: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
    });
    mockCollection.aggregate.mockReturnValue({
      toArray: vi.fn(),
    });
    mockDatabase.listCollections.mockReturnValue({
      toArray: vi.fn(),
    });
  });

  it('should insert single and multiple documents', async () => {
    // Setup mock return values
    const mockInsertOneResult = {
      acknowledged: true,
      insertedId: 'mock-id-123',
    };

    const mockInsertManyResult = {
      acknowledged: true,
      insertedCount: 2,
      insertedIds: ['mock-id-456', 'mock-id-789'],
    };

    mockCollection.insertOne.mockResolvedValue(mockInsertOneResult);
    mockCollection.insertMany.mockResolvedValue(mockInsertManyResult);

    // Import and execute the actual main function
    const { main } = await import('../203-insert-doc/index.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.insertOne).toHaveBeenCalled();
    expect(mockCollection.insertMany).toHaveBeenCalled();

    // Verify insertOne was called with correct structure
    expect(mockCollection.insertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        name: expect.stringContaining('product-'),
      })
    );

    // Verify insertMany was called with array of documents
    expect(mockCollection.insertMany).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.stringContaining('product-'),
        }),
      ])
    );

    // Verify result
    expect(result).toBe('done');
  });
});
