import dispatcher from '../dispatcher';
import {ReduceStore} from 'flux/utils';

class Store extends ReduceStore {
  getInitialState() {
    return {
      user: {},
      currentChannel: null,
      channels: [],
      messages: [],
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

      case 'post':
        break;

      case 'channel-created':
        newState = Object.assign({}, state, {
          channels: state.channels.concat(action.channel).sort(sortByName)
        });
        break;

      case 'init-app':
        newState = Object.assign({}, state, {
          channels: action.channels,
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
