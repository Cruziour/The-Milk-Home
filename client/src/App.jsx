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
import ProtectedRoute from "./utils/ProtectedRoute.jsx";

const App = () => {
  const router = createBrowserRouter(
    createRoutesFromChildren(
      <Route path="/" element={<Layout />}>
        <Route index element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["admin", "vendor"]} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/managemilk" element={<ManageMilk />} />
          <Route path="/addvendor" element={<AddVendor />} />
          <Route path="/updatevendor" element={<VendorUpdate />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/config" element={<Config />} />
        </Route>
        <Route element={<ProtectedRoute allowedRoles={["vendor"]} />}>
          <Route path="/myrecords" element={<MyRecords />} />
        </Route>
      </Route>
    )
  );
  return <RouterProvider router={router} />;
};

export default App;
