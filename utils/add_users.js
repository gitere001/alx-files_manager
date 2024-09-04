const axios = require('axios');

const BASE_URL = 'http://localhost:5000/files';
const TOKEN = '3688fa05-99b6-4706-adfb-0f3c500dfef5';
const FILE_ID_TO_TEST = '66d6b4c5d0101b0cc4f8c39f'; // Replace with the file ID you want to test

// Function to test PUT /files/:id/publish
const testPublish = async () => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${FILE_ID_TO_TEST}/publish`,
      {},
      { headers: { 'X-Token': TOKEN } }
    );
    console.log('Publish Response:', response.data);
  } catch (error) {
    console.error('Publish Error:', error.response ? error.response.data : error.message);
  }
};

// Function to test PUT /files/:id/unpublish
const testUnpublish = async () => {
  try {
    const response = await axios.put(
      `${BASE_URL}/${FILE_ID_TO_TEST}/unpublish`,
      {},
      { headers: { 'X-Token': TOKEN } }
    );
    console.log('Unpublish Response:', response.data);
  } catch (error) {
    console.error('Unpublish Error:', error.response ? error.response.data : error.message);
  }
};

const getFile = async (fileId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${fileId}`, { headers: { 'X-Token': TOKEN } });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
};

// Run tests
const runTests = async () => {
  console.log('Testing Publish Endpoint...');
  await testPublish();

  console.log('Testing Unpublish Endpoint...');
  await testUnpublish();

  const file = await getFile(FILE_ID_TO_TEST);
  if (file) {
    console.log('Testing Get Endpoint...');
    console.log('File:', file);
  }
};

runTests();
