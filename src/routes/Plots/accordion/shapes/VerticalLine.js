import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
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

export default function VerticalLine({ plotId, id }) {
  const dispatch = useDispatch();
  const shape = useSelector((state) => state.plots.plots[plotId].shapes[id].shape);

  const [x, setX] = useState(shape.x0);

  const handleDelete = () => {
    dispatch(deleteShape({ plotId, id }));
  };

  // const handleShapeChange = (value) => {
  //   dispatch(updateShape({
  //     plotId,
  //     id,
  //     newInput: {
  //       x0: parseFloat(value),
  //       x1: parseFloat(value)
  //     }
  //   }));
  // };
  const handleClick = () => {
    dispatch(updateShape({
      plotId,
      id,
      newInput: {
        x0: parseFloat(x),
        x1: parseFloat(x)
      }
    }));
  };

  const handleLineChange = (key, value) => {
    dispatch(updateShapeLineStyle({ plotId, id, newInput: { [key]: value } }));
  };

  console.log(shape.x0);
  console.log(String(shape.x0));
  console.log(parseFloat(shape.x0));

  return (
    <Fragment>
      <Typography>Vertical Line</Typography>
      <Typography>X value</Typography>
      <TextField
        margin="dense"
        id="x-label"
        type="input"
        variant="outlined"
        size="small"
        fullWidth
        // value={ shape.x0 }
        // onChange={ (event) => handleShapeChange(event.target.value) }
        value={ x }
        onChange={ (event) => setX(event.target.value) }
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
        <Button
          variant="contained"
          size="small"
          color="primary"
          onClick={ handleClick }
        >
          Update Plot
        </Button>
        <Tooltip title="Delete shape" placement="left">
          <IconButton onClick={ handleDelete }>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Fragment>
  );
}
