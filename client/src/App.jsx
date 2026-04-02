import React from "react";
import {
  createBrowserRouter,
  createRoutesFromChildren,
  Route,
  RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import {
  Home,
  About,
  Config,
  Contact,
  ManageMilk,
  AddVendor,
  VendorUpdate,
  Reports,
  Login,
  MyRecords,
} from "./pages/index.js";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/managemilk" element={<ManageMilk />} />
        <Route path="/addvendor" element={<AddVendor />} />
        <Route path="/updatevendor" element={<VendorUpdate />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/config" element={<Config />} />
        <Route path="/myrecords" element={<MyRecords />} />
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
