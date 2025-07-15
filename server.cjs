const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());

const ALLOWED_FEEDS = [
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml',
];

app.get('/api/rss', async (req, res) => {
  const { url } = req.query;
  if (!url || !ALLOWED_FEEDS.includes(url)) {
    return res.status(400).json({ error: 'Invalid or missing feed URL' });
  }
  try {
    const response = await axios.get(url);
    res.set('Content-Type', 'application/xml');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 