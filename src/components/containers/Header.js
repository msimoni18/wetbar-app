import * as React from "react";
import { Typography } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { HtmlTooltip } from "./tooltips/HtmlTooltip";

export default function Header(props) {
  const { heading, description } = props;

  return (
    <header style={ { marginBottom: "15px" } }>
      <div style={ { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" } }>
        <h1 style={ { marginRight: "1rem" } }>{heading}</h1>
        <HtmlTooltip
          title={ (
            <React.Fragment>
              <Typography>{description}</Typography>
            </React.Fragment>
          ) }
          placement="right"
        >
          <InfoIcon fontSize="small" color="action" />
        </HtmlTooltip>
      </div>
      <hr />
    </header>
  );
}
