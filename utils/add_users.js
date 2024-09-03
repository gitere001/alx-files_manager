const axios = require('axios');

// Define the base URL for the API
const baseUrl = 'http://localhost:5000';

// Function to get the authentication token
async function getConnect() {
  // Define the credentials
  const email = '2@gmail.com';
  const password = '2@100';

  // Encode credentials to Base64
  const authHeader = Buffer.from(`${email}:${password}`).toString('base64');

  // Define the URL of the endpoint
  const url = `${baseUrl}/connect`;

  try {
    // Perform the GET request to /connect
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${authHeader}`,
      },
    });
    console.log('Connect Response:', response.data);
    console.log(`Basic ${authHeader}`);
    return response.data.token; // Return the token received
  } catch (error) {
    // Handle errors
    if (error.response) {
      console.error('Connect Error:', error.response.data);
    } else {
      console.error('Connect Error:', error.message);
    }
    throw error; // Propagate the error
  }
}

// Function to get files with optional parentId and pagination
async function getFiles(token, parentId, page = 0) {
  const url = `${baseUrl}/files`;

  try {
    const response = await axios.get(url, {
      headers: {
        'X-Token': token,
      },
      params: {
        parentId,
        page,
      },
    });
    console.log('Files List:', response.data);
    console.log('Basic authenication :', )
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Get Files Error:', error.response.data);
    } else {
      console.error('Get Files Error:', error.message);
    }
    throw error;
  }
}

// Function to post a file
async function postFile(token, parentId) {
  const url = `${baseUrl}/files`;

  const payload = {
    name: 'myText.txt',
    type: 'text/plain',
    data: Buffer.from('Hello Webstack!\n').toString('base64'),
    isPublic: true,
    parentId: parentId, // Use the provided parentId
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json',
      },
    });
    console.log('File Upload Response:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('File Upload Error:', error.response.data);
    } else {
      console.error('File Upload Error:', error.message);
    }
  }
}

// Main function to execute the workflow
async function main() {
  try {
    const token = await getConnect();

    const parentId = '66d6b5a8d0101b0cc4f8c3a1'; // Example parentId, replace as needed

    // Post a file
    await postFile(token, parentId);

    // Get files with parentId and optional pagination (e.g., page 0)
    await getFiles(token, parentId, 0);

  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Execute the main function
main();
