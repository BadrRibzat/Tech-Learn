// backend/wetty.js
const express = require('express');
const http = require('http');
const Wetty = require('wetty');

const app = express();
const server = http.createServer(app);

const wetty = Wetty({
  ssh: {
    host: 'localhost',
    port: 2222,
    auth: 'password',
    username: 'root',
    password: 'rootpass'
  }
});

app.use('/terminal', wetty);
server.listen(3001, '0.0.0.0', () => {
  console.log('Wetty running on http://0.0.0.0:3001/terminal');
});
