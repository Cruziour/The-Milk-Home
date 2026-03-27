import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";

const App = () => {
  const mode = useSelector(state => state.theme.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
