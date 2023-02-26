import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { BrowserRouter } from "react-router-dom";
import "./style/style.scss";
import { Provider } from "react-redux/es/exports";
import { store } from "./store/store";

const container = document.getElementById("root") as Element;
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
