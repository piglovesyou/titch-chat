import {ninvoke} from 'q';
import createCookieParser from 'cookie-parser';
import SyncedDBBackend from 'synceddb-server';
import MemoryPersistence from 'synceddb-persistence-memory';
import sessionStore from './session-store';

const parseCookie = (() => {
  const parser = createCookieParser(process.env.SESSION_SECRET || 'baa');
  return (req) => new Promise((resolve, reject) => parser(req, null, resolve));
})();

export default async function initSyncedDB(server) {
  const store = await MemoryPersistence.create();
  const sdb = new SyncedDBBackend({server, store});

  for (let type of ['create', 'update', 'delete', 'reset']) {
    sdb.handlers[type] = async function (clientData, store, msg, respond, broadcast, req) {
      const user = await getUser(req);
      if (!user) return; // What should I do
      SyncedDBBackend.defaultHandlers[type].call(sdb, clientData, store, msg, respond, broadcast);
    };
  };
}

async function getUser(req) {
  const session = await getSession(req);
  return session.passport && session.passport.user;
}

async function getSession(req) {
  await parseCookie(req);
  const sessionID = req.signedCookies['connect.sid'];
  return await ninvoke(sessionStore, 'get', sessionID);
}
