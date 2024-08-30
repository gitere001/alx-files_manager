const { createClient } = require('redis');


/**
 * Redis client
 */
class RedisClient {
  constructor() {
    this.client = createClient();

    // Initialize connection status
    this.clientConnected = false;

    this.client.on('error', (err) => {
      console.error('Redis client encountered an error:', err);
      this.clientConnected = false;
    });

    this.client.on('connect', () => {
      this.clientConnected = true;
    });

    this.client.connect().catch((err) => {
      console.error('Failed to connect to Redis:', err);
      this.clientConnected = false;
    });
  }

  /**
   * Check if Redis client is alive by performing a PING command.
   * @returns {Promise<boolean>} True if Redis is connected, false otherwise.
   */
  isAlive() {
	return this.clientConnected;
  }

  /**
   * Gets value corresponding to key in Redis
   * @param {string} key - Key to search for in Redis
   * @returns {Promise<string | null>} Value of the key or null if an error occurs
   */
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (err) {
      console.warn('Error retrieving value from Redis:', err);
      return null;
    }
  }

  /**
   * Creates a new key in Redis with a specific TTL
   * @param {string} key - Key to be saved in Redis
   * @param {string} value - Value to be assigned to key
   * @param {number} duration - TTL of the key in seconds
   * @returns {Promise<void>}
   */
  async set(key, value, duration) {
    try {
      await this.client.setEx(String(key), duration, String(value));
    } catch (err) {
      console.warn('Error setting value in Redis:', err);
    }
  }

  /**
   * Deletes a key in Redis
   * @param {string} key - Key to be deleted
   * @returns {Promise<void>}
   */
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.warn('Error deleting value from Redis:', err);
    }
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
