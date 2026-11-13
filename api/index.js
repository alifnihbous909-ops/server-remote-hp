let lastCommand = null;

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    lastCommand = req.body;
    return res.status(200).json({ status: 'ok' });
  }

  if (req.method === 'GET') {
    const cmd = lastCommand;
    lastCommand = null;
    return res.status(200).json({ command: cmd });
  }

  res.status(404).send('Not Found');
}
