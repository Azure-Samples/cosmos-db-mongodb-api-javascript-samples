import { describe, it, expect, vi } from 'vitest';
import { mockClient, mockDatabase, mockCollection } from './setup.js';

describe('299-drop-collection', () => {
  it('should drop a collection', async () => {
    // Setup mock return values
    const mockDropResult = true;

    mockCollection.drop.mockResolvedValue(mockDropResult);

    // Import and execute the actual main function
    const { main } = await import('../299-drop-collection/index.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.collection).toHaveBeenCalledWith('products');
    expect(mockCollection.drop).toHaveBeenCalled();
    
    // Verify result
    expect(result).toBe('done');
  });
});
