let lastCommand = null;

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST' && req.url === '/command') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        lastCommand = JSON.parse(body);
        res.status(200).json({ status: 'ok' });
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
    return;
  }

  if (req.method === 'GET' && req.url === '/get-command') {
    const cmd = lastCommand;
    lastCommand = null;
    return res.status(200).json({ command: cmd });
  }

  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Remote HP</title>
      </head>
      <body style="background:#0f172a;color:white;text-align:center;padding:20px;font-family:sans-serif;">
        <h2>Remote Control HP</h2>
        <button onclick="send('flashlight', true)" style="padding:20px;font-size:18px;margin:10px;width:80%;">🔦 Senter ON</button><br>
        <button onclick="send('flashlight', false)" style="padding:20px;font-size:18px;margin:10px;width:80%;">💡 Senter OFF</button><br>
        <button onclick="send('vibrate')" style="padding:20px;font-size:18px;margin:10px;width:80%;">📳 Getar</button>
        <script>
          function send(action, value) {
            fetch('/command', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: action, value: value })
            }).then(() => alert('Terkirim!')).catch(() => alert('Gagal!'));
          }
        </script>
      </body>
      </html>
    `);
    return;
  }

  res.status(404).send('Not Found');
};
