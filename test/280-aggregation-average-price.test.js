import { describe, it, expect, vi } from 'vitest';
import { mockClient, mockDatabase, mockCollection } from './setup.js';

describe('280-aggregation - average-price-in-each-product-subcategory', () => {
  it('should perform aggregation to find average price by subcategory', async () => {
    // Setup mock return values
    const mockAggregationResult = [
      {
        _id: 'Bikes',
        averagePrice: 1200.50,
        count: 15
      },
      {
        _id: 'Surfboards',
        averagePrice: 450.75,
        count: 8
      }
    ];

    mockCollection.aggregate.mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockAggregationResult)
    });

    // Import and execute the actual main function
    const { main } = await import('../280-aggregation/average-price-in-each-product-subcategory.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.aggregate).toHaveBeenCalled();
    
    // Verify aggregation pipeline was called with an array
    expect(mockCollection.aggregate).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.any(Object)
      ])
    );
    
    // Verify result
    expect(result).toBe('done');
  });
});
