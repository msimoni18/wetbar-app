import "index.scss";
import * as serviceWorker from "serviceWorker";
import App from "App";
import { Provider } from "react-redux";
import React from "react";
import ReactDOM from "react-dom/client";
import store from "state/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
