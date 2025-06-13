import { describe, it, expect, vi } from 'vitest';
import { mockClient, mockDatabase } from './setup.js';

describe('300-drop-database', () => {
  it('should drop a database', async () => {
    // Setup mock return values
    const mockDropResult = {
      dropped: 'adventureworks',
      ok: 1
    };

    mockDatabase.dropDatabase.mockResolvedValue(mockDropResult);

    // Import and execute the actual main function
    const { main } = await import('../300-drop-database/index.js');
    const result = await main();

    // Verify the expected database operations were called
    expect(mockClient.connect).toHaveBeenCalled();
    expect(mockClient.db).toHaveBeenCalledWith('adventureworks');
    expect(mockDatabase.dropDatabase).toHaveBeenCalled();
    
    // Verify result
    expect(result).toBe('done');
  });
});
