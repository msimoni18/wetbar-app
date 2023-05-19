import * as React from "react";
import { RgbaColorPicker } from "react-colorful";
import { rgbaToString } from "utils/utilities";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Typography
} from "@mui/material";
import ColorLensIcon from "@mui/icons-material/ColorLens";

export default function ColorSelector({ initialColor, text, handleColorChange }) {
  const [openColorPicker, setOpenColorPicker] = React.useState(false);
  const [color, setColor] = React.useState(initialColor);

  const handleOpen = () => {
    setOpenColorPicker(true);
  };

  const handleClose = () => {
    setOpenColorPicker(false);
    handleColorChange(text, rgbaToString(color));
  };

  const handleRevertColor = () => {
    setColor(initialColor);
  };

  return (
    <Box sx={ {
      display: "flex",
      alignItems: "center",
      height: "25px",
      width: "80px",
      border: "1px solid black",
      borderRadius: "5px",
      overflow: "hidden"
    } }
    >
      <Box sx={ {
        width: "50px",
        height: "100%",
        background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
      } }
      />
      <Box sx={ {
        width: "30px",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      } }
      >
        <IconButton aria-label="color-selector" onClick={ handleOpen }>
          <ColorLensIcon fontSize="small" />
        </IconButton>
      </Box>
      <Dialog
        open={ openColorPicker }
        onClose={ handleClose }
        aria-labelledby="color-dialog"
        aria-describedby="pick a color"
      >
        <DialogContent>
          <RgbaColorPicker color={ color } onChange={ setColor } />
          <Box sx={ { textAlign: "center" } }>
            <Typography>R: {color.r}, G: {color.g}, B: {color.b}</Typography>
            <Typography>A: {color.a}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={ handleRevertColor }>Revert to original</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
