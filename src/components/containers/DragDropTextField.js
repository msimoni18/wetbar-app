import * as React from "react";
import { useDispatch } from "react-redux";
import { Box, IconButton, Typography } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./DragDropTextField.module.scss";

export default function DragDropTextField({ item, setItem }) {
  const dispatch = useDispatch();

  function dropHandler(e) {
    // Prevent default behavior (Prevent file from being opened)
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.items.length; i += 1) {
        // If dropped items aren't files, reject them
        if (e.dataTransfer.items[i].kind === "file") {
          const droppedItem = e.dataTransfer.items[i].getAsFile();
          dispatch(setItem(droppedItem.path));
        }
      }
    } else {
      // Use DataTransfer interface to access the file(s)
      for (let i = 0; i < e.dataTransfer.files.length; i += 1) {
        dispatch(setItem(e.dataTransfer.files[i].path));
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
        data-text="Drag and drop your file or folder here."
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
            <IconButton onClick={ () => dispatch(setItem("")) }>
              <ClearIcon fontSize="small" />
            </IconButton>
            <Typography>{item}</Typography>
          </Box>
        )}
      </div>
    </Box>
  );
}
