import {ninvoke, nfcall} from 'q';
import createCookieParser from 'cookie-parser';
import SyncedDBBackend from 'synceddb-server';
import MemoryPersistence from 'synceddb-persistence-memory';
import PostgresPersistence from 'synceddb-persistence-postgres';
import sessionStore from './session-store';
import passport from './passport';

const parseCookie = (() => {
  const parser = createCookieParser(process.env.SESSION_SECRET || 'baa');
  return (req) => new Promise((resolve, reject) => parser(req, null, resolve));
})();

export default async function initSyncedDB(server) {
  // const store = await MemoryPersistence.create();
  const store = await PostgresPersistence.create({
    conString: process.env.DATABASE_URL || 'postgres://pig@localhost/titch-chat',
  });
  const sdb = new SyncedDBBackend({server, store});

  for (let type of ['create', 'update', 'delete', 'reset']) {
    sdb.handlers[type] = async function (clientData, store, msg, respond, broadcast, req) {
      if (!await verifyMsg(msg, req)) return;
      SyncedDBBackend.defaultHandlers[type].call(sdb, clientData, store, msg, respond, broadcast);
    };
  };
}

async function verifyMsg(msg, req) {
  const user = await getUser(req);
  return msg.record.createdBy.name === user.name;
}

async function getUser(req) {
  const session = await getSession(req);
  if (!session || !session.passport || !session.passport.user) return;
  return await ninvoke(passport, 'deserializeUser', session.passport.user);
}

async function getSession(req) {
  await parseCookie(req);
  const sessionID = req.signedCookies['connect.sid'];
  return await ninvoke(sessionStore, 'get', sessionID);
}
