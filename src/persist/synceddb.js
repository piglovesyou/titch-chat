import syncedDB from 'synceddb-client';

const stores = {
  channels: [
    // {key: 'channel name', createdBy: 'user name', createdAt: Date}
    ['by name', 'name'],
    ['by createdAt', 'createdAt'],
  ],
  posts: [
    ['by channel, createdAt', ['channel', 'createdAt']],
  ]
};

const version = 7;
export const db = syncedDB.open({
  name: 'titch-chat',
  version,
  stores,
  url: (location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host,
  migrations: { [version]: eraseAll }
});

export async function putPost(text, channel, user) {
  const [key] = await db.posts.put({
    text,
    channel: channel.key,
    createdBy: user,
    createdAt: Date.now() // TODO 
  });
  return await db.posts.get(key);
}

export function getChannel(key) {
  return db.channels.get(key);
}

export function getPosts(key) {
  return db.posts['by channel, createdAt'].inRange({
    gt: [key, Number.MIN_VALUE],
    lt: [key, Number.MAX_VALUE],
    limit: 20,
    direction: 'prev'
  });
}

export async function putChannel(name, user) {
  const [key] = await db.channels.put({
    name: name,
    createdBy: user,
    createdAt: Date.now() // TODO 
  });
  return await db.channels.get(key);
}

function eraseAll(idb, e) {
  const tx = e.target.transaction;
  for (let name of ['channels', 'posts']) {
    tx.objectStore(name).clear();
  }
}
