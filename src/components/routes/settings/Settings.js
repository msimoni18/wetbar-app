import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "components/containers/Header";

export default function Settings() {
  return (
    <React.Fragment>
      <Header heading="Settings" />
    </React.Fragment>
  );
}
