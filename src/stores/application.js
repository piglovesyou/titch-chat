import dispatcher from '../dispatcher';
import {ReduceStore} from 'flux/utils';

class Store extends ReduceStore {
  getInitialState() {
    return {
      currentChannel: null,
      user: {},
      channels: [],
      posts: []
    };
  }
  reduce(state, action) {
    let newState;
    switch (action.type) {
      case 'post-create':
      case 'post-add':
        if (state.currentChannel.key !== action.record.channel) return state;
        state.posts.unshift(action.record);
        newState = Object.assign({}, state, {
          posts: state.posts.slice(0, 20)
        });
        break;

      case 'channel-create':
      case 'channel-add':
        newState = Object.assign({}, state, {
          currentChannel: action.record,
          channels: state.channels.concat(action.record).sort(sortByName),
        });
        break;

      case 'channel-delete':
        {
          const newChannels = state.channels.slice(0);
          const foundIndex = newChannels.findIndex((c) => c.key === action.record.key);
          if (foundIndex < 0) throw 'boom';
          newChannels.splice(foundIndex, 1);
          newState = Object.assign({}, state, {
            channels: newChannels,
          });
          if (state.currentChannel.key === action.record.key) {
            newState.currentChannel = null;
            newState.posts = [];
          }
        }
        break;

      case 'select-channel':
        newState = Object.assign({}, state, {
          currentChannel: action.channel,
          posts: action.posts,
        });
        break;

      case 'init-app':
        newState = Object.assign({}, state, {
          channels: action.channels,
          currentChannel: action.channels[0],
          posts: action.posts || [],
        });
        break;
    }
    return newState;

    function randomMessage() {
      return state.messages[Math.floor(Math.random() * state.messages.length)];
    }
  }
}

export default new Store(dispatcher);

function sortByName(a, b) {
  return a.name > b.name ? 1 : a.name < b.name ? -1 : 0;
}
