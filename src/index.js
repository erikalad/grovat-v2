import React from "react";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import store from "./../src/Redux/store";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import { HappyProvider } from '@ant-design/happy-work-theme';


const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
      <HappyProvider>
        <App />
        </HappyProvider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>
);
reportWebVitals();
