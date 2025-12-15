import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Mount React App
const container = document.getElementById("root");

if (!container) {
  throw new Error("❌ Root element #root not found in index.html");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
