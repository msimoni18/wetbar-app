import * as React from "react";
import { useDispatch } from "react-redux";
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
  Checkbox
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./DragDropFileContainer.module.scss";

export default function DragDropFileContainer(props) {
  const dispatch = useDispatch();
  const { items, setItems, deleteItem } = props;
  const [dense, setDense] = React.useState(false);
  const [secondary, setSecondary] = React.useState(false);

  function dropHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const file = e.dataTransfer.items[i].getAsFile();
          dispatch(setItems({
            name: file.name,
            path: file.path
          }));
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
        // Only add object if it is unique
        dispatch(setItems({
          name: e.dataTransfer.files[i].name,
          path: e.dataTransfer.files[i].path
        }));
      }
    }
  }

  function dragOverHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  }

  const handleDelete = (index) => {
    dispatch(deleteItem(index));
  };

  function generate() {
    return items.map((file, index) => {
      return (
        <ListItem
          key={ index }
          secondaryAction={ (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={ () => handleDelete(index) }
            >
              <DeleteIcon />
            </IconButton>
          ) }
        >
          <ListItemAvatar>
            <Avatar sx={ { width: 35, height: 35 } }>
              <FolderIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={ file.name }
            secondary={ secondary ? file.path : null }
          />
        </ListItem>
      );
    });
  }

  return (
    <Box sx={ { flexGrow: 1 } }>
      <Box sx={ { flexGrow: 1, marginLeft: "10px" } }>
        <FormGroup row>
          <FormControlLabel
            control={ (
              <Checkbox
                checked={ dense }
                onChange={ (event) => setDense(event.target.checked) }
              />
            ) }
            label="Enable dense"
          />
          <FormControlLabel
            control={ (
              <Checkbox
                checked={ secondary }
                onChange={ (event) => setSecondary(event.target.checked) }
              />
            ) }
            label="Show full file path"
          />
        </FormGroup>
      </Box>
      <div
        className={ styles["drag-drop-container"] }
        data-text="Drag and drop your file(s) here."
        onDrop={ dropHandler }
        onDragOver={ dragOverHandler }
      >
        {items?.length > 0 && <List dense={ dense }>{generate()}</List>}
      </div>
    </Box>
  );
}
