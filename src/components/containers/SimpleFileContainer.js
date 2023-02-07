import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";

import styles from "./SimpleFileContainer.module.scss";

export default function SimpleFileContainer(props) {
  const { data } = props;

  const generateList = () => {
    return data.data?.map((item, index) => {
      const pathName = item.file;
      return (
        <ListItem key={ index }>
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
