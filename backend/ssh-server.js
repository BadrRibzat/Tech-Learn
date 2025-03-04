// backend/ssh-server.js
const { Client } = require('ssh2');
const WebSocket = require('ws');
const { createServer } = require('http');

const httpServer = createServer();
const wss = new WebSocket.Server({ server: httpServer });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  const ssh = new Client();

  ssh.on('ready', () => {
    console.log('SSH connected');
    ssh.shell((err, stream) => {
      if (err) {
        console.error('SSH shell error:', err);
        ws.send(JSON.stringify({ error: err.message }));
        ws.close();
        return;
      }
      ws.on('message', (data) => stream.write(data));
      stream.on('data', (data) => ws.send(data.toString('utf8')));
      stream.on('close', () => {
        ws.close();
        ssh.end();
      });
    });
  }).on('error', (err) => {
    console.error('SSH error:', err);
    ws.send(JSON.stringify({ error: err.message }));
    ws.close();
  }).on('close', () => {
    console.log('SSH disconnected');
    ws.close();
  }).connect({
    host: 'localhost',
    port: 2222,
    username: 'root',
    password: 'rootpass'
  });

  ws.on('close', () => ssh.end());
  ws.on('error', (err) => console.error('WebSocket error:', err));
});

httpServer.listen(3001, '0.0.0.0', () => {
  console.log('WebSocket server on http://0.0.0.0:3001');
});
