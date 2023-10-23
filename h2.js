'use strict';
const { createSecureServer } = require('node:http2');
const { createServer } = require('node:https');
const { readFileSync } = require('node:fs');

const cert = readFileSync('./application/cert/default/cert.pem');
const key = readFileSync('./application/cert/default/key.pem');

const server = createSecureServer(
  { cert, key, allowHTTP1: false },
  onRequest,
).listen(443);
const server2 = createServer({ cert, key }, onRequest).listen(server);
function onRequest(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const {
    socket: { alpnProtocol },
  } = req.httpVersion === '2.0' ? req.stream.session : req;
  res.writeHead(200, { 'content-type': 'application/json' });
  res.end(
    JSON.stringify({
      alpnProtocol,
      httpVersion: req.httpVersion,
      rrr: 'kkkkk',
    }),
  );
}
function onRequest1(req, res) {
  // Detects if it is a HTTPS request or HTTP/2
  const {
    socket: { alpnProtocol },
  } = req.httpVersion === '2.0' ? req.stream.session : req;
  console.log(JSON.stringify({ alpnProtocol, httpVersion: req.httpVersion }));
  /*res.end(
    JSON.stringify({
      alpnProtocol,
      httpVersion: req.httpVersion,
    }),
  );*/
}
