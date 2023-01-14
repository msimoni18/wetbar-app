import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';

import styles from './SimpleFileContainer.module.scss';

export default function SimpleFileContainer(props) {
  const { files } = props;

  const generateList = () => {
    return files['files']?.map((item, index) => {
      const pathName = item;
      return (
        <ListItem key={index}>
          <ListItemText primary={pathName}></ListItemText>
        </ListItem>
      );
    });
  };

  return (
    <div className={styles['simple-file-container']}>
      {files['files']?.length === 0 ? (
        <p className={styles['empty-container']}>{files['message']}</p>
      ) : (
        <List dense>{generateList()}</List>
      )}
    </div>
  );
}
