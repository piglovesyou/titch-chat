import {dispatch} from '../dispatcher';
import isBrowser from 'is-browser';

// Server doesn't want it
let synceddb = {};
if (isBrowser) synceddb = require('../persist/synceddb');
let {db, putPost, putChannel, getChannel, getPosts} = synceddb;
if (isBrowser) initialAction();

export async function post(text, currentChannel, user) {
  await putPost(text, currentChannel, user);
}

export async function createChannel(name, user) {
  // TODO check duplication
  await putChannel(name, user);
}

export async function selectChannel(channel_) {
  const channel = await getChannel(channel_.key);
  const posts = await getPosts(channel.key);
  dispatch({
    type: 'select-channel',
    channel,
    posts
  });
}

async function initialAction() {
  await db.sync({continuously: true});
  const channels = await db.channels['by name'].getAll();
  const [channel] = channels;
  const posts = channel ? await getPosts(channel.key) : [];
  dispatch({
    type: 'init-app',
    channels,
    posts,
  });
  db.posts.on('add', async (e) => { 
    dispatch({ type: 'create-post', post: e.record });
  });
  db.channels.on('add', (e) => { 
    dispatch({ type: 'channel-created', channel: e.record });
  });
  window.db = db;
}
