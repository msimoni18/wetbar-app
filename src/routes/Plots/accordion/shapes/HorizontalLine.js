import React, { Fragment } from "react";
import { rgbaToString } from "utils/utilities";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Tooltip,
  IconButton,
  TextField,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ColorSelector from "components/containers/ColorSelector";
import { deleteShape, updateShape, updateShapeLineStyle } from "../../plotsSlice";
import { shapeColors } from "./colors";

export default function HorizontalLine({ plotId, id }) {
  const dispatch = useDispatch();
  const shape = useSelector((state) => state.plots.plots[plotId].shapes[id].shape);

  const handleDelete = () => {
    dispatch(deleteShape({ plotId, id }));
  };

  const handleShapeChange = (value) => {
    dispatch(updateShape({
      plotId,
      id,
      newInput: {
        y0: Number(value),
        y1: Number(value)
      }
    }));
  };

  const handleLineChange = (key, value) => {
    dispatch(updateShapeLineStyle({ plotId, id, newInput: { [key]: value } }));
  };

  return (
    <Fragment>
      <Typography>Horizontal Line</Typography>
      <Typography>Y value</Typography>
      <TextField
        margin="dense"
        id="y-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ shape.y0 }
        onChange={ (event) => handleShapeChange(event.target.value) }
      />
      <Typography>Color</Typography>
      <ColorSelector
        initialColor={ shapeColors.shapeline }
        text="color"
        handleColorChange={ handleLineChange }
      />
      <Typography>Width</Typography>
      <TextField
        margin="dense"
        id="shape-line-width-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ shape.line.width }
        onChange={ (event) => handleLineChange("width", event.target.value) }
      />
      <Box sx={ { width: "100%", textAlign: "right" } }>
        <Tooltip title="Delete shape" placement="left">
          <IconButton onClick={ handleDelete }>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Fragment>
  );
}
