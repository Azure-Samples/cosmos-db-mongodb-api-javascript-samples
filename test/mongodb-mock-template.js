// Complete MongoDB Mock Template for all test cases
// This mock handles all the common MongoDB operations used across the samples

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
  deleteOne: vi.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 1
  }),
  deleteMany: vi.fn().mockResolvedValue({
    acknowledged: true,
    deletedCount: 5
  }),
  createIndex: vi.fn().mockResolvedValue('mock-index-name'),
  getIndexes: vi.fn().mockResolvedValue([
    { v: 1, key: { _id: 1 }, name: '_id_' },
    { v: 1, key: { name: 1 }, name: 'name_1' }
  ]),
  indexes: vi.fn().mockResolvedValue([
    { v: 1, key: { _id: 1 }, name: '_id_' },
    { v: 1, key: { name: 1 }, name: 'name_1' }
  ]),
  bulkWrite: vi.fn().mockResolvedValue({
    acknowledged: true,
    insertedCount: 2,
    matchedCount: 1,
    modifiedCount: 1,
    deletedCount: 0
  }),
  countDocuments: vi.fn().mockResolvedValue(5),
  drop: vi.fn().mockResolvedValue(true),
  // For aggregation operations
  aggregate: vi.fn(() => ({
    toArray: vi.fn().mockResolvedValue([
      { _id: 'category1', averagePrice: 100 },
      { _id: 'category2', averagePrice: 200 }
    ])
  }))
};

const mockDatabase = {
  collection: vi.fn(() => mockCollection),
  admin: vi.fn(() => ({
    listDatabases: vi.fn().mockResolvedValue({
      databases: [
        { name: 'adventureworks', sizeOnDisk: 1000 },
        { name: 'test', sizeOnDisk: 500 }
      ]
    }),
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
    })
  })),
  dropDatabase: vi.fn().mockResolvedValue(true),
  dropCollection: vi.fn().mockResolvedValue(true),
  listCollections: vi.fn(() => ({
    toArray: vi.fn().mockResolvedValue([
      { name: 'products', type: 'collection' },
      { name: 'customers', type: 'collection' }
    ])
  })),
  // Iterator support for listCollections
  [Symbol.asyncIterator]: vi.fn(function* () {
    yield { name: 'products', type: 'collection' };
    yield { name: 'customers', type: 'collection' };
  })
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
  }
};

export { mockClient, mockDatabase, mockCollection };
