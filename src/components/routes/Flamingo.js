import React from 'react';
import Header from 'components/containers/Header';
import styles from 'components/App.module.scss';

export default function Flamingo() {
  return (
    <div className={styles['route-body']}>
      <Header
        heading='Flamingo'
        description='User interface for running flamingo.'
      />
    </div>
  );
}
