import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { registerSW } from "virtual:pwa-register";
import App from "./App.js";
import { processQueue } from "./offline/syncQueue.js";
import "./styles/index.css";

registerSW({ immediate: true });

// Push any queued service logs the moment connectivity returns, plus once on boot in case we're already online.
window.addEventListener("online", () => void processQueue());
if (navigator.onLine) void processQueue();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
