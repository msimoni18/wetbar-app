import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "components/containers/Header";

export default function Settings() {
  return (
    <React.Fragment>
      <Header heading="Settings" />
      <div>
        Settings stuff to go here...
      </div>
    </React.Fragment>
  );
}
