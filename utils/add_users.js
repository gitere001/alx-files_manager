const axios = require('axios');

const baseurl = 'http://0.0.0.0:5000';

const addUser = async (email, password) => {
  try {
    const response = await axios.post(`${baseurl}/users`, {
      email,
      password,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Print the response data
    console.log(response.data);
  } catch (error) {
    // Print error response data
    console.error(error.response ? error.response.data : error.message);
  }
};

const getStats = async (what) => {
  try {
    const res = await axios.get(`${baseurl}/${what}`);
    console.log(res.data);
  } catch (err) {
    console.log(err.res);
  }
};

const run = async () => {
  await getStats('status');
};
run()
