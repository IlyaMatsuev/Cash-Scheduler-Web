const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');
const { readFileSync } = require('fs');

const httpsConfig = require('./config').server;
const httpsCredentials = {
    key: readFileSync('certs/server.key', 'utf8'),
    cert: readFileSync('certs/server.cert', 'utf8')
};

const app = express();

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));


https.createServer(httpsCredentials, app).listen(httpsConfig.port, httpsConfig.host, () => {
    console.log(`Listening to https://${httpsConfig.host}:${httpsConfig.port}/`);
});
