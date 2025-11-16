const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage for messages
const messages = {}; // { channelId: [{ user, text, timestamp }] }

// Get the last 100 messages for a channel
app.get('/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  res.json(messages[channelId] || []);
});

// Post a new message to a channel
app.post('/messages/:channelId', (req, res) => {
  const { channelId } = req.params;
  const { user, text } = req.body;

  if (!user || !text) {
    return res.status(400).json({ error: 'User and text are required.' });
  }

  if (!messages[channelId]) {
    messages[channelId] = [];
  }

  // Add the new message
  messages[channelId].push({
    user,
    text,
    timestamp: new Date().toISOString(),
  });

  // Keep only the last 100 messages
  if (messages[channelId].length > 100) {
    messages[channelId].shift();
  }

  res.status(201).json({ success: true });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});