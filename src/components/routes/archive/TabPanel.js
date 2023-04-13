import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={ value !== index }
      id={ `tabpanel-${index}` }
      { ...other }
    >
      {value === index && (
        <Box sx={ { marginLeft: "1%", marginTop: "1%" } }>{children}</Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

function allyProps(index) {
  return {
    "id": `tab-${index}`,
    "aria-controls": `tabpanel-${index}`
  };
}

export { TabPanel, allyProps };