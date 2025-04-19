const WebSocket = require('ws');
const { Client } = require('ssh2');

const wss = new WebSocket.Server({ port: 3001 });
console.log('WebSocket server running on ws://0.0.0.0:3001');

const sessions = new Map();

wss.on('connection', (ws, req) => {
  const clientId = req.headers['sec-websocket-key'] || Date.now().toString();
  console.log('New WebSocket connection from', req.socket.remoteAddress, 'ID:', clientId);

  const ssh = new Client();

  ssh.on('ready', () => {
    console.log('SSH connected to localhost:2222');
    ws.send('Connected to terminal\r\n');
    sessions.set(clientId, { ws, ssh });

    ssh.shell({ term: 'xterm', cols: 80, rows: 24 }, (err, stream) => {
      if (err) {
        console.error('SSH shell error:', err.message);
        ws.send(`Error: ${err.message}\r\n`);
        ws.close(1011, 'SSH shell error');
        return;
      }

      stream.on('data', (data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data.toString());
        }
      });

      stream.on('error', (err) => {
        console.error('Stream error:', err.message);
        ws.send(`Stream error: ${err.message}\r\n`);
      });

      stream.on('close', () => {
        console.log('SSH stream closed for client', clientId);
        ws.close(1000, 'SSH stream closed');
        ssh.end();
      });

      ws.on('message', (data) => {
        if (stream.writable) {
          stream.write(data.toString());
        }
      });

      ws.on('close', (code, reason) => {
        console.log('WebSocket closed for client', clientId, 'code:', code, 'reason:', reason);
        stream.end();
        ssh.end();
        sessions.delete(clientId);
      });

      ws.on('error', (err) => {
        console.error('WebSocket error for client', clientId, ':', err.message);
        stream.end();
        ssh.end();
      });
    });
  });

  ssh.on('error', (err) => {
    console.error('SSH error for client', clientId, ':', err.message);
    ws.send(`SSH Error: ${err.message}\r\n`);
    ws.close(1011, 'SSH error');
  });

  ssh.on('close', () => {
    console.log('SSH connection closed for client', clientId);
    if (ws.readyState === WebSocket.OPEN) {
      ws.close(1000, 'SSH connection closed');
    }
    sessions.delete(clientId);
  });

  ssh.connect({
    host: 'localhost',
    port: 2222,
    username: 'root',
    password: 'root',
    keepaliveInterval: 0, // Disable keepalives to avoid REQUEST_FAILURE
    readyTimeout: 20000,
  });
});

wss.on('error', (err) => {
  console.error('WebSocket server error:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err.message);
});
