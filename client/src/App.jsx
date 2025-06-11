import React, { Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Loading from "./Components/Interface/Loading";

// Lazy Components
const UserLayouts = lazy(() => import("./Components/Layouts/UserLayouts"));
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Profile = lazy(() => import("./Pages/Profile"));
const Collection = lazy(() => import("./Pages/CollectionPage"));
const ProductDetails = lazy(() =>
  import("./Components/Products/ProductDetails")
);
const CheckOut = lazy(() => import("./Components/Cart/CheckOut"));
const OrderConfirmation = lazy(() => import("./Pages/OrderConfirmationPage"));
const OrderDetailsPage = lazy(() => import("./Pages/OrderDetailsPage"));
const MyOrderPage = lazy(() => import("./Pages/MyOrderPage"));

const ProtectLayout = lazy(() => import("./Components/Common/ProtectRoute"));
const AdminLayout = lazy(() => import("./Components/Admin/AdminLayout"));
const AdminHomePage = lazy(() => import("./Pages/AdminHomePage"));
const UserManagement = lazy(() => import("./Components/Admin/UserManagement"));
const ProductManagement = lazy(() =>
  import("./Components/Admin/ProductManagement")
);
const AddNewProducts = lazy(() => import('./Components/Admin/AddNewProducts'))
const EditProductPage = lazy(() =>
  import("./Components/Admin/EditProductPage")
);
const OrderManagement = lazy(() =>
  import("./Components/Admin/OrderManagement")
);

const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <UserLayouts />,
      children: [
        { path: "/", element: <Home /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
        { path: "profile", element: <Profile /> },
        { path: "collections/:collection", element: <Collection /> },
        { path: "product/:id", element: <ProductDetails /> },
        { path: "checkout", element: <CheckOut /> },
        { path: "order-confirmation", element: <OrderConfirmation /> },
        { path: "order/:id", element: <OrderDetailsPage /> },
        { path: "my-order", element: <MyOrderPage /> },
      ],
    },
    {
      path: "/admin",
      element: (
        <ProtectLayout role="admin">
          <AdminLayout />
        </ProtectLayout>
      ),
      children: [
        { path: "", element: <AdminHomePage /> },
        { path: "users", element: <UserManagement /> },
        { path: "products", element: <ProductManagement /> },
        { path: "add-product", element: <AddNewProducts /> },
        { path: "products/:id/edit", element: <EditProductPage /> },
        { path: "orders", element: <OrderManagement /> },
      ],
    },
  ]);
  return (
    <Suspense fallback={<Loading />}>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </Suspense>
  );
};

export default App;
