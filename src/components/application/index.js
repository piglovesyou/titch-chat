import React from 'react';
import {Container} from 'flux/utils';
import Store from '../../stores/application';
import Toolbar from '../toolbar';
import Navigation from '../navigation';
import s from './index.sass';
import UserFace from '../user-face';
import Channels from '../channels';
import Chats from '../chats';
import ChatInput from '../chat-input';
import isBrowser from 'is-browser';
import Actions from '../../actions';

class Application extends React.Component {
  static getStores() {
    return [Store];
  }

  static calculateState(prevState) {
    return Store.getState();
  }

  render() {
    const {title, messages, user, channels, posts} = this.state;

    // debugger;
    return (
      <div className={s.root + ' ' + s.layoutMasterDetail}>
        <div className={s.layoutMasterDetailMaster}>
          <UserFace {...user} />
          <Channels {...this.state} />
        </div>
        <div className={s.layoutMasterDetailDetail}>
          <Chats posts={posts} />
          <ChatInput />
        </div>
      </div>
    );
  }
};

export default Container.create(Application);
