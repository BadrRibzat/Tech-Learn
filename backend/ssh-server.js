const WebSocket = require('ws');
const { Client } = require('ssh2');

const wss = new WebSocket.Server({ port: 3001 });
console.log('WebSocket server running on ws://0.0.0.0:3001');

wss.on('connection', (ws) => {
  console.log('New WebSocket connection established');
  const ssh = new Client();

  ssh.on('ready', () => {
    console.log('SSH connection ready');
    ws.send('SSH connection established\r\n');
    ssh.shell({ term: 'xterm' }, (err, stream) => {
      if (err) {
        console.error('SSH shell error:', err);
        ws.send(`Error: ${err.message}\r\n`);
        ws.close();
        return;
      }

      stream.on('data', (data) => {
        ws.send(data.toString());
      });

      stream.on('error', (err) => {
        console.error('Stream error:', err);
        ws.send(`Stream error: ${err.message}\r\n`);
      });

      stream.on('close', () => {
        console.log('SSH stream closed');
        ws.close();
        ssh.end();
      });

      ws.on('message', (data) => {
        try {
          stream.write(data.toString());
        } catch (err) {
          console.error('Error writing to stream:', err);
        }
      });

      ws.on('close', () => {
        console.log('WebSocket closed by client');
        stream.end();
        ssh.end();
      });

      ws.on('error', (err) => {
        console.error('WebSocket error:', err);
      });
    });
  });

  ssh.on('error', (err) => {
    console.error('SSH connection error:', err);
    ws.send(`SSH Error: ${err.message}\r\n`);
    ws.close();
  });

  ssh.on('close', () => {
    console.log('SSH connection closed');
    ws.close();
  });

  try {
    ssh.connect({
      host: 'localhost',
      port: 2222,
      username: 'root',
      password: 'root',
      keepaliveInterval: 10000,
      keepaliveCountMax: 3
    });
  } catch (err) {
    console.error('SSH connect error:', err);
    ws.send(`Connection failed: ${err.message}\r\n`);
    ws.close();
  }
});

wss.on('error', (err) => {
  console.error('WebSocket server error:', err);
});
