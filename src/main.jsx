import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { installDemoApi } from "./demoApi.js";
import "./index.css";

if (import.meta.env.VITE_DEMO === "true") installDemoApi();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary><App /></ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);

// Errors outside React (e.g. a script failing to load) also get shown on screen
window.addEventListener("error", (e) => {
  const root = document.getElementById("root");
  if (root && !root.children.length) root.textContent = "Error: " + e.message;
});
