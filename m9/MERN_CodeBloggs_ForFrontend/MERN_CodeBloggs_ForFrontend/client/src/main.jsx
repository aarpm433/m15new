import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CookiesProvider } from "react-cookie";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import Bloggs from "./components/Bloggs.jsx";
import AdminView from "./components/Admin.jsx";
import Network from "./components/network.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserManager from "./components/UserManagaer.jsx";
import UserDetails from "./components/UserDetails.jsx";
import UserSettings from "./components/UserSettings.jsx";
import ContentManager from "./components/ContentManager.jsx";

const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <App />,
        children: [
          { path: "home", element: <Home /> },
          { path: "settings", element: <UserSettings/> },
          { path: "bloggs", element: <Bloggs /> },
          { path: "network", element: <Network /> },
          { path: "admin", element: <AdminView /> },
          {path: "admin/users", element: <UserManager/> },
          {path: "users/:id", element: <UserDetails/> },
          {path: "admin/content", element: <ContentManager/> },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </CookiesProvider>
  </React.StrictMode>
);
