import { describe, expect } from '@jest/globals';
import { CacheManager } from '../../../utils/CacheManager.js';

describe('CacheManager', () => {
  let cacheManager: CacheManager<string>;

  beforeEach(() => {
    cacheManager = new CacheManager(3);
  });

  it('should add key-value pairs to the cache', () => {
    cacheManager.addKeyInCache('key1', 'value1');
    cacheManager.addKeyInCache('key2', 'value2');
    cacheManager.addKeyInCache('key3', 'value3');

    expect(cacheManager.cache.size).toBe(3);
    expect(cacheManager.getValueInKey('key1')).toBe('value1');
    expect(cacheManager.getValueInKey('key2')).toBe('value2');
    expect(cacheManager.getValueInKey('key3')).toBe('value3');
  });

  it('should update the value of an existing key in the cache', () => {
    cacheManager.addKeyInCache('key1', 'value1');
    cacheManager.addKeyInCache('key2', 'value2');

    cacheManager.addKeyInCache('key1', 'new-value1'); // Update the value

    expect(cacheManager.cache.size).toBe(2);
    expect(cacheManager.getValueInKey('key1')).toBe('new-value1');
  });

  it('should remove the least recently used key when reaching capacity', () => {
    cacheManager.addKeyInCache('key1', 'value1');
    cacheManager.addKeyInCache('key2', 'value2');
    cacheManager.addKeyInCache('key3', 'value3'); 

    // The cache is at its capacity (3)

    cacheManager.addKeyInCache('key4', 'value4'); // This will cause removal of 'key1'

    expect(cacheManager.cache.size).toBe(3);
    expect(cacheManager.getValueInKey('key1')).toBeNull(); // 'key1' is removed from the cache
    expect(cacheManager.getValueInKey('key2')).toBe('value2');
    expect(cacheManager.getValueInKey('key3')).toBe('value3');
    expect(cacheManager.getValueInKey('key4')).toBe('value4');
  });

  it('should correctly move a key to the front when accessed', () => {
    cacheManager.addKeyInCache('key1', 'value1');
    cacheManager.addKeyInCache('key2', 'value2');
    cacheManager.addKeyInCache('key3', 'value3');

    // Accessing 'key2' should move it to the front

    cacheManager.getValueInKey('key2');

    expect(cacheManager.cache.size).toBe(3);
    expect(cacheManager.getValueInKey('key1')).toBe('value1');
    expect(cacheManager.getValueInKey('key2')).toBe('value2'); // 'key2' is now at the front
    expect(cacheManager.getValueInKey('key3')).toBe('value3');
  });
});
