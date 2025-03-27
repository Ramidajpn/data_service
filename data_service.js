const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;
const AUTHEN_SERVICE_URL = process.env.AUTHEN_SERVICE_URL || 'https://authen-service-1.onrender.com';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const friendsData = {
  'friend1': { name: 'Alice', status: 'online' },
  'friend2': { name: 'Bob', status: 'offline' }
};

app.get('/data', async (req, res) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  try {
    const response = await axios.get(`${AUTHEN_SERVICE_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 200) {
      return res.status(200).json({
        success: true,
        data: 'you have done'
      });
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.get('/friend/:friendId', async (req, res) => {
  let token = req.headers['authorization'];
  const friendId = req.params.friendId;
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }
  try {
    const response = await axios.get(`${AUTHEN_SERVICE_URL}/verify`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.status === 200) {
      const friend = friendsData[friendId];
      if (friend) {
        return res.status(200).json({
          success: true,
          data: friend
        });
      } else {
        return res.status(404).json({ error: 'Friend not found' });
      }
    }
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
});

app.listen(PORT, () => {
  console.log(`Data Service is running on port ${PORT}`);
});