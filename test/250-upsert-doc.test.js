import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING =
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

describe('250-upsert-doc', () => {
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

  it('should upsert documents', async () => {
    // Setup mock return values
    const mockUpsertResult = {
      acknowledged: true,
      modifiedCount: 0,
      upsertedId: 'mock-id-123',
      upsertedCount: 1,
      matchedCount: 0,
    };

    mockCollection.updateOne.mockResolvedValue(mockUpsertResult);

    // Import and execute the actual main function
    const { main } = await import('../250-upsert-doc/index.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.updateOne).toHaveBeenCalled();
    expect(mockClient.close).toHaveBeenCalled();

    // Verify result
    expect(result).toBe('done');
  });
});
