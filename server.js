/*
stAuth936961,I Mashrur Alam, 000936961 certify that this material is my original work. No other person's work has been used without due acknowledgement.
 I have not made my work available to anyone else."

*/


const express = require('express');
const cors = require('cors');
const redis = require('redis');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Redis Client
const client = redis.createClient({
  url: "redis://redis-17212.c277.us-east-1-3.ec2.redns.redis-cloud.com:17212",
  password: "SjPh2qWL1HZFnMDd5Fpol3u3BD6WDYcx"
});

client.connect().catch(console.error);

// Constants
const TODO_KEY = "todo_list";

// On startup, initialize empty list if not already set
(async () => {
  const exists = await client.exists(TODO_KEY);
  if (!exists) {
    await client.set(TODO_KEY, JSON.stringify([]));
  }
})();

// Load Route
app.get('/load', async (req, res) => {
  try {
    const data = await client.get(TODO_KEY);
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({ error: 'Failed to load TODO list' });
  }
});

// Save Route
app.post('/save', async (req, res) => {
  const items = req.body;
  try {
    await client.set(TODO_KEY, JSON.stringify(items));
    res.json({ status: 'save successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save TODO list' });
  }
});

// Clear Route
app.get('/clear', async (req, res) => {
  try {
    await client.set(TODO_KEY, JSON.stringify([]));
    res.json({ status: 'clear successful' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to clear TODO list' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
