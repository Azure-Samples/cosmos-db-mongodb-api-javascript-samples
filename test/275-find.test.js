import { describe, it, expect, vi } from 'vitest';
import { mockClient, mockDatabase, mockCollection } from './setup.js';

describe('275-find', () => {
  it('should perform various find operations', async () => {
    // Setup mock return values
    const mockProduct = {
      _id: 'mock-id-123',
      name: 'Yamba Surfboard-42',
      category: 'gear-surf-surfboards',
      quantity: 12,
      sale: false
    };

    const mockProducts = [mockProduct, { ...mockProduct, _id: 'mock-id-456' }];

    // Mock find operations
    mockCollection.findOne.mockResolvedValue(mockProduct);
    mockCollection.find.mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockProducts),
      limit: vi.fn().mockReturnThis(),
      skip: vi.fn().mockReturnThis()
    });

    // Import and execute the actual main function
    const { main } = await import('../275-find/index.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.findOne).toHaveBeenCalled();
    expect(mockCollection.find).toHaveBeenCalled();
    
    // Verify result
    expect(result).toBe('done');
  });
});
