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

export const db = syncedDB.open({
  name: 'titch-chat',
  version: 1,
  stores,
  remote: location.host
});

export function putPost(text) {
}

export function getChannel(key) {
  return db.channels.get(key);
}

export function putChannel(name, user) {
  return db.channels.put({
    name: name,
    createdBy: user.name,
    createdAt: Date.now() // TODO 
  });
}
