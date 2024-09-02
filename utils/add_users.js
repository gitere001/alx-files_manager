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
        'Authorization': `Basic ${authHeader}`
      }
    });
    console.log('Connect Response:', response.data);
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

// Function to post a file
async function postFile(token) {
  // Define the URL of the endpoint
  const url = `${baseUrl}/files`;

  // Define the request payload
  const payload = {
    name: 'myText.txt',
    type: 'file',
    data: 'SGVsbG8gV2Vic3RhY2shCg==' // Base64 encoded data for "Hello Webstack!\n"
    // Optionally add parentId and isPublic if needed
  };

  try {
    // Perform the POST request to /files
    const response = await axios.post(url, payload, {
      headers: {
        'X-Token': token, // Use the token received from getConnect
        'Content-Type': 'application/json'
      }
    });
    console.log('File Upload Response:', response.data);
  } catch (error) {
    // Handle errors
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
    await postFile(token);
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Execute the main function
main();
