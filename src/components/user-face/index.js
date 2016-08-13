import React from 'react';
import s from './index.sass';

export default function UserFace(user) {
  return (
    <div className={s.root}>
      {user ? userFace(user) : loginLink()}
    </div>
  );
};

function loginLink() {
  return <a href="/auth/google">Join by logging in</a>
}

function userFace(user) {
  return [<img className={s.photo} src={user.photo} />, <span className={s.name}>{user.name}</span>];
}
