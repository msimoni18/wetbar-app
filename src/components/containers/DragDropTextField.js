import * as React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

import styles from "./DragDropTextField.module.scss";

export default function DragDropTextField(props) {
  const { item, setItem } = props;

  function dropHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const droppedItem = e.dataTransfer.items[i].getAsFile();
          setItem(droppedItem.path);
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
        setItem(e.dataTransfer.files[i].path);
      }
    }
  }

  function dragOverHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();
  }

  return (
    <Box sx={ { flexGrow: 1 } }>
      <div
        className={ styles["drag-drop-textfield"] }
        data-text="Drag and drop your folder here."
        onDrop={ dropHandler }
        onDragOver={ dragOverHandler }
      >
        {item
        && (
          <Box sx={ {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "nowrap"
          } }
          >
            <Typography>{item}</Typography>
            <IconButton onClick={ () => setItem("") }>
              <ClearIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </div>
    </Box>
  );
}
