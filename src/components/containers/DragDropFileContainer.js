import * as React from 'react';

import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './DragDropFileContainer.module.scss';

export default function DragDropFileContainer(props) {
  const { files, setFiles } = props;

  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  function dropHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === 'file') {
          const file = e.dataTransfer.items[i].getAsFile();

          // Only add object if it is unique
          isUnique({
            name: file.name,
            path: file.path,
          });
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        // Only add object if it is unique
        isUnique({
          name: e.dataTransfer.files[i].name,
          path: e.dataTransfer.files[i].path,
        });
      }
    }
  }

  function dragOverHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  }

  function isUnique(newContent) {
    const index = files.findIndex((object) => object.path === newContent.path);
    if (index === -1) {
      setFiles((previousContent) => {
        return [...previousContent, newContent];
      });
    }
  }

  const handleDelete = (index) => {
    const newFiles = (files) => files.filter((item, i) => i !== index);
    setFiles(newFiles);
  };

  function generate() {
    return files.map((file, index) => {
      return (
        <ListItem
          key={index}
          secondaryAction={
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleDelete(index)}
            >
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={file['name']}
            secondary={secondary ? file['path'] : null}
          />
        </ListItem>
      );
    });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ flexGrow: 1, marginLeft: '10px' }}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={dense}
                onChange={(event) => setDense(event.target.checked)}
              />
            }
            label="Enable dense"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={secondary}
                onChange={(event) => setSecondary(event.target.checked)}
              />
            }
            label="Enable secondary text"
          />
        </FormGroup>
      </Box>
      <div
        className={styles['drag-drop-container']}
        data-text="Drag and drop your file(s) here."
        onDrop={dropHandler}
        onDragOver={dragOverHandler}
      >
        {files.length > 0 && <List dense={dense}>{generate()}</List>}
      </div>
    </Box>
  );
}
