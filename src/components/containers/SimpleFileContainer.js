import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "./SimpleFileContainer.module.scss";

export default function SimpleFileContainer(props) {
  const { data, handleDelete } = props;

  const generateList = () => {
    return data.data?.map((item, index) => {
      const pathName = item.file;
      return (
        <ListItem
          key={ index }
          secondaryAction={ (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={ () => handleDelete(pathName) }
            >
              <DeleteIcon />
            </IconButton>
          ) }
        >
          <ListItemText primary={ pathName } />
        </ListItem>
      );
    });
  };

  return (
    <div className={ styles["simple-file-container"] }>
      {data.data?.length === 0 ? (
        <p className={ styles["empty-container"] }>{data.message}</p>
      ) : (
        <List dense>{generateList()}</List>
      )}
    </div>
  );
}
