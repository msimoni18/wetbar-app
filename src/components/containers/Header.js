import React from "react";

export default function Header(props) {
  const { heading, description } = props;

  return (
    <header style={ { textAlign: "center", marginBottom: "15px" } }>
      <h1 style={ { marginBottom: "5px" } }>{heading}</h1>
      <p style={ { marginBottom: "15px" } }>{description}</p>
      <hr />
    </header>
  );
}
