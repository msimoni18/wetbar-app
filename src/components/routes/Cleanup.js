import React from 'react';
import Header from 'components/containers/Header';
import styles from 'components/App.module.scss';

export default function Cleanup() {
  return (
    <div className={styles['route-body']}>
      <Header
        heading='Cleanup'
        description='Easily delete unwanted files to clear shared space for your coworkers.'
      />
    </div>
  );
}
