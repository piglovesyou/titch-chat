import React from 'react';
import {Container} from 'flux/utils';
import Store from '../../stores/application';
import Toolbar from '../toolbar';
import Navigation from '../navigation';
import s from './index.sass';
import UserFace from '../user-face';
import Channels from '../channels';
import Posts from '../posts';
import ChatInput from '../chat-input';
import ChannelBar from '../channel-bar';
import isBrowser from 'is-browser';

class Application extends React.Component {
  static getStores() {
    return [Store];
  }

  static calculateState(prevState) {
    return Store.getState();
  }

  render() {
    const {title, messages, user, channels, posts, currentChannel} = this.state;
    return (
      <div className={s.root + ' ' + s.layoutMasterDetail}>
        <div className={s.layoutMasterDetailMaster}>
          <UserFace {...user} />
          <Channels {...this.state} />
        </div>
        <div className={s.layoutMasterDetailDetail}>
          {currentChannel ? <ChannelBar currentChannel={currentChannel} /> : null}
          <Posts posts={posts} />
          <ChatInput user={user} currentChannel={currentChannel} />
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    
  }
};

export default Container.create(Application);
