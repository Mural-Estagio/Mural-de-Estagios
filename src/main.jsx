// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Importe o BrowserRouter
import App from "./App.jsx"; 

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Adicione o BrowserRouter aqui */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);