// Test file to debug ObjectId mocking
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock environment variables
process.env.AZURE_COSMOS_DB_MONGODB_CONNECTION_STRING = 'mongodb://localhost:27017';

// Mock the entire mongodb module with ObjectId
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
          toArray: vi.fn().mockResolvedValue([])
        })),
        updateOne: vi.fn(),
        deleteOne: vi.fn().mockResolvedValue({ deletedCount: 1 }),
        deleteMany: vi.fn().mockResolvedValue({ deletedCount: 3 }),
        createIndex: vi.fn(),
        getIndexes: vi.fn().mockResolvedValue([]),
        bulkWrite: vi.fn(),
        countDocuments: vi.fn().mockResolvedValue(0)
      })),
      admin: vi.fn(() => ({
        listDatabases: vi.fn().mockResolvedValue({ databases: [] })
      })),
      dropDatabase: vi.fn(),
      dropCollection: vi.fn()
    }))
  })),
  ObjectId: vi.fn().mockImplementation((id) => ({
    toString: () => id || '507f1f77bcf86cd799439011',
    toHexString: () => id || '507f1f77bcf86cd799439011'
  }))
}));

describe('ObjectId Debug Test', () => {
  it('should be able to import ObjectId', async () => {
    const { ObjectId } = await import('mongodb');
    const id = new ObjectId('123456789012345678901234');
    expect(id.toString()).toBe('123456789012345678901234');
  });
});
