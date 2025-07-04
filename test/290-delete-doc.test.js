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

describe('290-delete-doc Sample', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock return values
    mockCollection.find.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
      limit: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
    });
    mockCollection.findOne.mockResolvedValue(null);
    mockCollection.deleteOne.mockResolvedValue({ deletedCount: 1 });
    mockCollection.deleteMany.mockResolvedValue({ deletedCount: 3 });
    mockCollection.countDocuments.mockResolvedValue(0);
    mockCollection.aggregate.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([]),
    });
    mockDatabase.listCollections.mockReturnValue({
      toArray: vi.fn().mockResolvedValue([{ name: 'products' }]),
    });
  });

  it('should execute main function successfully', async () => {
    // Import the main function
    const { main } = await import('../290-delete-doc/index.js');

    // Execute the main function
    await expect(main()).resolves.not.toThrow();
  });
});
