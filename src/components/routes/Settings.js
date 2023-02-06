import * as React from "react";

import Header from "components/containers/Header";
import styles from "components/App.module.scss";

export default function Settings() {
  return (
    <div className={ styles["route-body"] }>
      <Header heading="Settings" />
    </div>
  );
}
