import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, IconButton, Tooltip } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import VerticleLine from "./shapes/VerticalLine";
import HorizontalLine from "./shapes/HorizontalLine";
import Rectangle from "./shapes/Rectangle";
import { addShape } from "../plotsSlice";
import { formatItemStyle } from "./styles";

export default function Annotate({ id }) {
  const dispatch = useDispatch();
  const { shapes } = useSelector((state) => state.plots.plots[id]);

  const addVLine = () => {
    dispatch(addShape({ id, type: "vline" }));
  };

  const addHLine = () => {
    dispatch(addShape({ id, type: "hline" }));
  };

  const addRect = () => {
    dispatch(addShape({ id, type: "rect" }));
  };

  function renderShape(type, pid, sid) {
    if (type === "vline") {
      return (
        <VerticleLine
          key={ sid }
          plotId={ pid }
          id={ shapes[sid].id }
        />
      );
    } if (type === "hline") {
      return (
        <HorizontalLine
          key={ sid }
          plotId={ pid }
          id={ shapes[sid].id }
        />
      );
    }
    return (
      <Rectangle
        key={ sid }
        plotId={ pid }
        id={ shapes[sid].id }
      />
    );

  }

  return (
    <Fragment>
      {Object.keys(shapes)?.map((shapeId) => (
        <Box key={ shapeId } sx={ formatItemStyle }>
          {renderShape(shapes[shapeId].type, id, shapeId)}
        </Box>
      ))}
      <Box sx={ { display: "flex", justifyContent: "space-evenly" } }>
        <Tooltip title="Add vertical line" placement="bottom">
          <IconButton onClick={ addVLine }>
            <RemoveIcon sx={ { transform: "rotate(90deg)" } } />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add horizontal line" placement="bottom">
          <IconButton onClick={ addHLine }>
            <RemoveIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Add rectangle" placement="bottom">
          <IconButton onClick={ addRect }>
            <CropSquareIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Fragment>
  );
}
