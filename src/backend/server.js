import SyncedDBBackend from 'synceddb-server';
import MemoryPersistence from 'synceddb-persistence-memory';
import express from './express';
import http from 'http';

const debug = require('debug')('site:server');
const port = express.get('port');


const server = http.createServer(express);
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
(async () => {
  debugger;
  const store = await MemoryPersistence.create();
  debugger;
  new SyncedDBBackend({server, store});
})();


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
}