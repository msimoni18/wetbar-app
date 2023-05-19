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

export default function Rectangle({ plotId, id }) {
  const dispatch = useDispatch();
  const shape = useSelector((state) => state.plots.plots[plotId].shapes[id].shape);

  const handleDelete = () => {
    dispatch(deleteShape({ plotId, id }));
  };

  const handleShapeChange = (name, value) => {
    dispatch(updateShape({ plotId, id, newInput: { [name]: Number(value) } }));
  };

  const handleLineChange = (key, value) => {
    dispatch(updateShapeLineStyle({ plotId, id, newInput: { [key]: value } }));
  };

  const handleFillChange = (name, value) => {
    dispatch(updateShape({ plotId, id, newInput: { [name]: value } }));
  };

  return (
    <Fragment>
      <Typography>Rectangle</Typography>
      <Typography>X0</Typography>
      <TextField
        margin="dense"
        id="x0-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ shape.x0 }
        onChange={ (event) => handleShapeChange("x0", event.target.value) }
      />
      <Typography>X1</Typography>
      <TextField
        margin="dense"
        id="x1-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ shape.x1 }
        onChange={ (event) => handleShapeChange("x1", event.target.value) }
      />
      <Typography>Y0</Typography>
      <TextField
        margin="dense"
        id="y0-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ shape.y0 }
        onChange={ (event) => handleShapeChange("y0", event.target.value) }
      />
      <Typography>Y1</Typography>
      <TextField
        margin="dense"
        id="y1-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        value={ shape.y1 }
        onChange={ (event) => handleShapeChange("y1", event.target.value) }
      />
      <Typography>Line Color</Typography>
      <ColorSelector
        initialColor={ shapeColors.shapeline }
        text="color"
        handleColorChange={ handleLineChange }
      />
      <Typography>Line Width</Typography>
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
      <Typography>Fill Color</Typography>
      <ColorSelector
        initialColor={ shapeColors.shapefill }
        text="fillcolor"
        handleColorChange={ handleFillChange }
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
