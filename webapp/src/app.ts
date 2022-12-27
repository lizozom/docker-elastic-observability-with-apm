// Init APM agent before making any imports
require('elastic-apm-node').start()

import express from 'express';
import path from 'path';
import { readFileSync } from 'fs';

const htmlTemplate = readFileSync(path.join(__dirname, '/index.html')).toString();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.header('Content-Type', 'text/html');
  const clientContext = {
    ELASTIC_APM_SERVER_URL: process.env.ELASTIC_APM_SERVER_URL || '',
  };
  const html = htmlTemplate.replace("${ENV_VARS}", JSON.stringify(clientContext));
  console.log(clientContext)
  res.send(html);
});

app.get('/sampleapi', (req, res) => {
  res.header('Content-Type', 'application/json');
  res.send({
    now: new Date().getTime(),
  });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});