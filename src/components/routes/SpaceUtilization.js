import React from 'react';
import Header from 'components/containers/Header';
import styles from 'components/App.module.scss';

export default function SpaceUtilization() {
  return (
    <div className={styles['route-body']}>
      <Header
        heading='Space Utilization'
        description='Figure out how much space your taking up.'
      />
    </div>
  );
}
