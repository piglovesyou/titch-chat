import React from 'react';
import s from './index.sass';
import moment from 'moment';

function Post(props) {
  var date = moment(props.createdAt).fromNow();
  return (
    <div className={s.post}>
      <img className={s.photo} src={props.createdBy.photo} />
      <span className={s.text}>{props.text}</span>
      <span className={s.date}>{date}</span>
    </div>
  );
};

export default function Posts(props) {
  const {posts} = props;
  return (
    <div className={s.root}>
      {posts.map(p => <Post key={p.key} {...p} />)}
    </div>
  );
};
