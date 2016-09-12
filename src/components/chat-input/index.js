import React from 'react';
import s from './index.sass';
import {post} from '../../actions';

export default class ChatInput extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <input className={s.input} ref="text" type="text" placeholder="Write ..." />
        </form>
      </div>
    );
  }
  handleSubmit(e) {
    e.preventDefault();
    const {user, currentChannel} = this.props;
    if (!currentChannel || !user) return
    post(this.refs.text.value, currentChannel, user);
    this.refs.text.value = '';
  }
};

