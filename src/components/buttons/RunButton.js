import React from 'react';
import styles from './RunButton.module.scss';

export default function RunButton(props) {
  const { handleClick } = props;

  return (
    <button className={styles['run-btn']} onClick={handleClick}>
      Run
    </button>
  );
}
