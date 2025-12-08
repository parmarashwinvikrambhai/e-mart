import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";

// Layouts
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Pages
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Order from "./pages/Order";
import Product from "./pages/Product";
import PlaceOrder from "./pages/PlaceOrder";
import Dashboard from "./pages/admin/Dashboard";
import AddItems from "./pages/admin/AddItems";
import ListItems from "./pages/admin/ListItems";
import Orders from "./pages/admin/Orders";
import type { JSX } from "react";
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";

// Protected layout
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

// Prevent logged-in users from visiting login/register
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (isAuthenticated) {
    if (user?.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};


function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route element={<PublicLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registration"
          element={
            <PublicRoute>
              <Registration />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
      </Route>

      {/* Protected pages */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/about" element={<About />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePassword/>} />
        </Route>

        {/* Admin pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-item" element={<AddItems />} />
          <Route path="item-list" element={<ListItems />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>

      {/* Default redirect if path not found */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
