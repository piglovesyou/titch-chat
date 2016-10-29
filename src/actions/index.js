import {dispatch} from '../dispatcher';
import isBrowser from 'is-browser';

// Server doesn't want it
let synceddb = {};
if (isBrowser) synceddb = require('../persist/synceddb');
if (isBrowser) initialAction();

export async function post(text, currentChannel, user) {
  await synceddb.putPost(text, currentChannel, user);
}

export async function createChannel(name, user) {
  // TODO check duplication
  await synceddb.putChannel(name, user);
}

export async function deleteChannel(channel) {
  await synceddb.db.channels.delete(channel.key);
}

export async function selectChannel(channel_) {
  const channel = await synceddb.getChannel(channel_.key);
  const posts = await synceddb.getPosts(channel.key);
  dispatch({
    type: 'select-channel',
    channel,
    posts
  });
}

async function initialAction() {
  const {db} = synceddb;
  await db.sync({continuously: true});
  const channels = await db.channels['by name'].getAll();
  const [channel] = channels;
  const posts = channel ? await synceddb.getPosts(channel.key) : [];
  dispatch({
    type: 'init-app',
    channels,
    posts,
  });

  for (let type of ['create', 'add']) {
    db.posts.on(type, async (e) => { 
      dispatch({ type: `post-${type}`, record: e.record });
    });
    db.channels.on(type, (e) => { 
      dispatch({ type: `channel-${type}`, record: e.record });
    });
  }

  for (let type of ['delete']) {
    db.posts.on(type, async (e) => { 
      dispatch({ type: `post-${type}`, record: e.record });
    });
    db.channels.on(type, (e) => { 
      dispatch({ type: `channel-${type}`, record: e.record });
    });
  }
  // , 'update', 
  
  window.db = db;
}
