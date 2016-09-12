import React from 'react';
import s from './index.sass';
import {selectChannel, createChannel} from '../../actions';
import Modal from 'react-modal';

export default function Channel(props) {
  const classNames = [s.item];
  if (props.current) classNames.push('current');
  return (
    <div>
      <a className={classNames.join(' ')}
          href="select channel"
          onClick={props.onClick}
      >
        {props.children}
      </a>
    </div>
  );
};

export default class Channels extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  render() {
    const {channels, currentChannel} = this.props;
    const currentChannelKey = currentChannel && currentChannel.key;
    const {open} = this.state;
    return (
      <div className={s.root}>
        <div className={s.buttonWrapper}>
          <button className={s.createButton} onClick={this.handleStartCreateChannel.bind(this)}>Create channel</button>
        </div>
        <div>
          {channels.map(c =>
            <Channel onClick={handleChannelSelect.bind(null, c)}
              key={c.key}
              current={c.key === currentChannelKey}
            >{c.name}</Channel>
          )}
        </div>
        <Modal
          className={s.modal}
          isOpen={this.state.open}
          onAfterOpen={this.handleAfterOpen.bind(this)}
          onRequestClose={this.handleClose.bind(this)}
          closeTimeoutMS={0}
        >
          <form onSubmit={this.handleSubmit.bind(this)}>
            <div className={s.modalContent}>
              <h5>Create new channel</h5>
              <div><input placeholder="New channel name" ref="new-channel-name" type="text" /></div>
            </div>
            <div className={s.modalActions}>
              <button type="reset" onClick={this.handleClose.bind(this)}>Cancel</button>
              <button type="submit" className="primary">Create</button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  handleSubmit(e) {
    e.preventDefault();
    const {value} = this.refs['new-channel-name'];
    if (value) {
      createChannel(value, this.props.user);
      this.handleClose();
    }
  }

  handleAfterOpen() {
    this.refs['new-channel-name'].focus();
  }

  handleClose() {
    this.setState({open: false});
  }

  handleStartCreateChannel(e) {
    this.setState({open: true});
  }
};

function handleChannelSelect(channel, e) {
  selectChannel(channel);
  e.preventDefault();
}
