import * as React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import styles from './ListContainer.module.scss';

export default function ListContainer(props) {
  const { files } = props;

  function generate() {
    return files.map((file, index) => {
      return (
        <ListItem key={index}>
          <ListItemText primary={`${index + 1} -- ${file}`} />
        </ListItem>
      );
    });
  }

  return (
    <div
      className={styles['list-container']}
      data-text="No files were found based on the folders and file extensions provided."
    >
      {files.length > 0 && <List dense={true}>{generate()}</List>}
    </div>
  );
}
