import React from 'react';
import s from './index.sass';

export default function UserFace(user) {
  return (
    <div className={s.root}>
      {user.hasOwnProperty('name') ? userFace(user) : loginLink()}
    </div>
  );
};

function loginLink() {
  return <a href="/auth/google">Join by logging in</a>
}

function userFace(user) {
  return [<img key="photo" className={s.photo} src={user.photo} />, <span key="name" className={s.name}>{user.name}</span>];
}
