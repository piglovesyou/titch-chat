import {dispatch} from '../dispatcher';
import isBrowser from 'is-browser';

// Server doesn't want it
let synceddb = {};
if (isBrowser) synceddb = require('../persist/synceddb');
let {db, putPost, putChannel, getChannel} = synceddb;
if (isBrowser) initialAction();

export function baam(message) {
  dispatch({ type: 'baam' });
}

export function post(message) {
  dispatch({ type: 'post', message });
}

export async function createChannel(name, user) {
  // TODO check duplication
  await putChannel(name, user);
}

async function initialAction() {
  await db.sync({continuously: true});
  const channels = await db.channels['by name'].getAll();
  const posts = await db.posts['by channel, createdAt'].inRange();
  dispatch({
    type: 'init-app',
    channels
  });
  db.channels.on('add', (e) => { 
    dispatch({
      type: 'channel-created',
      channel: e.record
    });
  });
  window.db = db;
}
