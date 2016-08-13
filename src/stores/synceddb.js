import syncedDB from 'synceddb-client';

const stores = {
  channels: [
    ['byCreation', 'createdAt'],
  ],
  posts: [
    ['byChannel', 'channel'],
    ['byCreation', 'createdAt'],
  ]
};

export const db = syncedDB.open({
  name: 'titch-chat',
  version: 1,
  stores,
  remote: location.host
});
