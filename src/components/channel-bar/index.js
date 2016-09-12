import React from 'react';
import s from './index.sass';

export default class ChannelBar extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <h1 className={s.title}>{this.props.currentChannel.name}</h1>
      </div>
    );
  }
};
