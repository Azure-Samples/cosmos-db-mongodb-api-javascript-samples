import { describe, it, expect, vi } from 'vitest';
import { mockClient, mockDatabase, mockCollection } from './setup.js';

describe('280-aggregation - bike-types-and-price-ranges', () => {
  it('should perform aggregation to find bike price ranges by subcategory', async () => {
    // Setup mock return values
    const mockAggregationResult = [
      {
        _id: ['Touring Bikes'],
        maxPrice: 1800.99,
        averagePrice: 1400.50,
        minPrice: 999.99,
        countOfProducts: 5
      },
      {
        _id: ['Mountain Bikes'],
        maxPrice: 2200.00,
        averagePrice: 1650.75,
        minPrice: 1100.00,
        countOfProducts: 8
      }
    ];

    mockCollection.aggregate.mockReturnValue({
      toArray: vi.fn().mockResolvedValue(mockAggregationResult)
    });

    // Import and execute the actual main function
    const { main } = await import('../280-aggregation/bike-types-and-price-ranges.js');
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
