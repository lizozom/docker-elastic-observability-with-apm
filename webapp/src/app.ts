// Init APM agent before making any imports
require('elastic-apm-node').start()

import express from 'express';
import path from 'path';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});