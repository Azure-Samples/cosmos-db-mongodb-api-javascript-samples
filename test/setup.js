import { vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.COSMOS_CONNECTION_STRING =
  'mongodb://mocked-connection-string';

// Create the mock objects outside of the vi.mock call
const createMockCollection = () => ({
  insertOne: vi.fn(),
  insertMany: vi.fn(),
  findOne: vi.fn(),
  find: vi.fn().mockReturnValue({
    toArray: vi.fn(),
    limit: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
  }),
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
  aggregate: vi.fn().mockReturnValue({
    toArray: vi.fn(),
  }),
  get collectionName() {
    return 'products';
  },
});

const createMockAdmin = () => ({
  serverInfo: vi.fn(),
  serverStatus: vi.fn(),
  listDatabases: vi.fn(),
});

const createMockDatabase = (mockCollection, mockAdmin) => ({
  collection: vi.fn(() => mockCollection),
  admin: vi.fn(() => mockAdmin),
  dropDatabase: vi.fn(),
  listCollections: vi.fn().mockReturnValue({
    toArray: vi.fn(),
  }),
  get databaseName() {
    return 'adventureworks';
  },
});

const createMockClient = mockDatabase => ({
  connect: vi.fn(),
  close: vi.fn(),
  db: vi.fn(() => mockDatabase),
});

// Create the actual mock objects
export const mockCollection = createMockCollection();
export const mockAdmin = createMockAdmin();
export const mockDatabase = createMockDatabase(mockCollection, mockAdmin);
export const mockClient = createMockClient(mockDatabase);

// Mock MongoDB module
vi.mock('mongodb', () => ({
  MongoClient: vi.fn(() => mockClient),
  ObjectId: vi.fn(id => ({ _id: id || 'mocked-object-id' })),
}));

// Reset all mocks before each test but preserve mock implementations
beforeEach(() => {
  vi.clearAllMocks();

  // Re-setup mock return values after clearing
  mockDatabase.admin.mockReturnValue(mockAdmin);
  mockDatabase.collection.mockReturnValue(mockCollection);
  mockDatabase.listCollections.mockReturnValue({
    toArray: vi.fn(),
  });

  mockCollection.find.mockReturnValue({
    toArray: vi.fn(),
    limit: vi.fn().mockReturnThis(),
    skip: vi.fn().mockReturnThis(),
    sort: vi.fn().mockReturnThis(),
  });
  mockCollection.aggregate.mockReturnValue({
    toArray: vi.fn(),
  });
});
