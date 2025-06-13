import { describe, it, expect, vi } from 'vitest';
import { mockClient, mockDatabase, mockCollection } from './setup.js';

describe('290-delete-doc', () => {
  it('should delete single and multiple documents', async () => {
    // Setup mock return values
    const mockDeleteOneResult = {
      acknowledged: true,
      deletedCount: 1
    };

    const mockDeleteManyResult = {
      acknowledged: true,
      deletedCount: 3
    };

    mockCollection.deleteOne.mockResolvedValue(mockDeleteOneResult);
    mockCollection.deleteMany.mockResolvedValue(mockDeleteManyResult);

    // Import and execute the actual main function
    const { main } = await import('../290-delete-doc/index.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.deleteOne).toHaveBeenCalled();
    expect(mockCollection.deleteMany).toHaveBeenCalled();
    
    // Verify delete operations were called with query objects
    expect(mockCollection.deleteOne).toHaveBeenCalledWith(
      expect.any(Object)
    );
    expect(mockCollection.deleteMany).toHaveBeenCalledWith(
      expect.any(Object)
    );
    
    // Verify result
    expect(result).toBe('done');
  });
});
