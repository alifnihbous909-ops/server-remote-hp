let lastCommand = null;

module.exports = (req, res) => {
  // CORS agar bisa diakses dari mana saja
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Jika HP 1 mengirim perintah (via tombol web)
  if (req.method === 'POST' && req.url === '/command') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        lastCommand = JSON.parse(body);
        res.status(200).json({ status: 'ok', received: lastCommand });
      } catch (e) {
        res.status(400).json({ error: 'Invalid JSON' });
      }
    });
    return;
  }

  // Jika HP 2 meminta perintah (polling)
  if (req.method === 'GET' && req.url === '/get-command') {
    const cmd = lastCommand;
    lastCommand = null; // hapus setelah diambil
    return res.status(200).json({ command: cmd });
  }

  // Tampilan Web Controller untuk HP 1
  if (req.method === 'GET' && req.url === '/') {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Remote HP</title>
        <style>
          body { font-family: sans-serif; text-align: center; background: #0f172a; color: white; padding: 20px; }
          button { padding: 20px; font-size: 18px; margin: 10px; border-radius: 10px; border: none; background: #1e293b; color: white; width: 80%; max-width: 300px; }
          button:active { background: #334155; }
        </style>
      </head>
      <body>
        <h2>Remote Control HP</h2>
        <button onclick="send('flashlight', true)">🔦 Senter ON</button><br>
        <button onclick="send('flashlight', false)">💡 Senter OFF</button><br>
        <button onclick="send('vibrate')">📳 Getar</button>
        <script>
          function send(action, value) {
            fetch('/command', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ action: action, value: value })
            }).then(() => alert('Perintah terkirim!')).catch(() => alert('Gagal!'));
          }
        </script>
      </body>
      </html>
    `);
    return;
  }

  res.status(404).send('Not Found');
};
