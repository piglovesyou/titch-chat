import React from 'react';
import s from './index.sass';

export default function(props) {
  return (
    <div className={s.root}>
      <form>
        <input type="text" placeholder="Write ..." />
      </form>
    </div>
  );
};