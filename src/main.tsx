import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { TaskProvider } from "./context/TaskContext";
import { TaskModalProvider } from "./context/TaskModalContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <TaskModalProvider>
          <App />
        </TaskModalProvider>
      </TaskProvider>
    </BrowserRouter>
  </React.StrictMode>
);