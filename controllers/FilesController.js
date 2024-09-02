const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class FilesController {
  static async postUpload(req, res) {
    // Retrieve the token and user ID
    const token = req.headers['x-token'];
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract file details from request body
    const {
      name, type, parentId = 0, isPublic = false, data,
    } = req.body;

    // Validate name
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    // Validate type
    if (!type) {
      return res.status(400).json({ error: 'Missing type' });
    }
    if (type !== 'file' && type !== 'image' && type !== 'folder') {
      return res.status(400).json({ error: 'Invalid type' });
    }

    // Validate data if type is file or image
    if (type === 'file' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }
    if (type === 'image' && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // Check parent file if parentId is set
    if (parentId !== 0) {
      const parentFile = await (await dbClient.filesCollection()).findOne({ _id: parentId });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    // Define folder path and create if not exists
    const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Handle folder type
    if (type === 'folder') {
      const result = await (await dbClient.filesCollection()).insertOne({
        userId,
        name,
        type,
        parentId,
        isPublic,
        localPath: null,
      });
      return res.status(201).json({
        id: result.insertedId,
        name,
        type,
        parentId,
        isPublic,
      });
    }

    // Handle file and image types
    const uniqueFilename = uuidv4();
    const base64Data = data.replace(/^data:.*;base64,/, '');
    const filePath = path.join(folderPath, uniqueFilename);

    try {
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to save file' });
    }

    const result = await (await dbClient.filesCollection()).insertOne({
      userId,
      name,
      type,
      parentId,
      isPublic,
      localPath: filePath,
    });
    return res.status(201).json({
      id: result.insertedId,
      name,
      type,
      parentId,
      isPublic,
      localPath: filePath,
    });
  }
}

module.exports = FilesController;
