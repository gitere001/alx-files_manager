const axios = require('axios');

// Define the credentials
const email = '1@gmail.com';
const password = '1@100';

// Encode credentials to Base64
const authHeader = Buffer.from(`${email}:${password}`).toString('base64');

// Define the URL of the endpoint
const url = 'http://localhost:5000/connect';

// Perform the request
axios.get(url, {
  headers: {
    'Authorization': `Basic ${authHeader}`
  }
})
  .then(response => {
    // Print the successful response
    console.log('Response:', response.data);
  })
  .catch(error => {
    // Print the error response
    if (error.response) {
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  });
