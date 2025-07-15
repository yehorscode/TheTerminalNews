import axios from 'axios';

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

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url || !ALLOWED_FEEDS.includes(url)) {
    return res.status(400).json({ error: 'Invalid or missing feed URL' });
  }
  try {
    const response = await axios.get(url);
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch RSS' });
  }
} 