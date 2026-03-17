import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";
import App from "./App.jsx";
import { AuthProvider } from "./AuthContext.jsx";

const Router = import.meta.env.VITE_ROUTER_MODE === "hash" ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <App />
        <ToastContainer position="top-right" />
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
