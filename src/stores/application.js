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
      case 'baam':
        newState = Object.assign({}, state, {
          messages: state.messages.concat(randomMessage())
        });
        console.log(newState.messages)
        break;

      case 'create-post':
        state.posts.unshift(action.post);
        newState = Object.assign({}, state, {
          posts: state.posts.slice(0, 20)
        });
        break;

      case 'select-channel':
        newState = Object.assign({}, state, {
          currentChannel: action.channel,
          posts: action.posts,
        });
        break;

      case 'channel-created':
        newState = Object.assign({}, state, {
          channels: state.channels.concat(action.channel).sort(sortByName)
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
