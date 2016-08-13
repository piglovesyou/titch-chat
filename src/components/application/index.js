import React from 'react';
import {Container} from 'flux/utils';
import Store from '../../stores/application';
import Actions from '../../actions';
import Toolbar from '../toolbar';
import Navigation from '../navigation';
import s from './index.sass';
import UserFace from '../user-face';
import Channels from '../channels';
import Chats from '../chats';
import ChatInput from '../chat-input';

class Application extends React.Component {
  static getStores() {
    return [Store];
  }

  static calculateState(prevState) {
    return Store.getState();
  }

  render() {
    const {title, messages} = this.state;

    // debugger;
    return (
      <div className={s.root + ' ' + s.layoutMasterDetail}>
        <div className={s.layoutMasterDetailMaster}>
          <UserFace />
          <Channels />
        </div>
        <div className={s.layoutMasterDetailDetail}>
          <Chats />
          <ChatInput />
        </div>
      </div>
    );
  }
};

export default Container.create(Application);
