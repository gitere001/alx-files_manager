const { ObjectId } = require('mongodb');
const sha1 = require('sha1');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async getMe(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    let userId = await redisClient.get(`auth_${token}`);
    console.log(`user id: ${userId}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    userId = new ObjectId(userId);
    const user = await (await dbClient.usersCollection()).findOne({ _id: userId });
    const data = { email: user.email, id: user._id };

    return res.status(200).json(data);
  }

  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const user = await (await dbClient.usersCollection()).findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const hashedPassword = sha1(password);
    const result = await (await dbClient.usersCollection())
      .insertOne({ email, password: hashedPassword });

    return res.status(201).json({ id: result.insertedId, email });
  }
}

module.exports = UsersController;
