import React from 'react';
import s from './index.sass';

export default class Chats extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={s.root}>
        <video ref="video" muted={true} autoPlay={true}></video>
      </div>
    );
  }

  componentDidMount() {
    
  }
};
