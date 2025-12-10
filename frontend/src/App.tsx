import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import type { JSX } from "react";
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
import ProfilePage from "./pages/ProfilePage";
import ChangePassword from "./pages/ChangePassword";
import TrackOrderPage from "./pages/TrackOrderPage";
import FakePaypal from "./pages/FakePaypal";
// Admin-only Route
const AdminRoute = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user?.isAdmin) return <Navigate to="/" replace />;
  return <Outlet />;
};
// User-only (Protected) Route
const UserRoute = () => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user?.isAdmin) return <Navigate to="/admin" replace />;
  return <Outlet />;
};
// Public Route (login/register)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated) {
    if (user?.isAdmin) return <Navigate to="/admin" replace />;
    return <Navigate to="/" replace />;
  }
  return children;
};
// Component to prevent Admin from accessing general public pages
const PreventAdminAccess = ({ children }: { children: JSX.Element }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  if (isAuthenticated && user?.isAdmin) {
    return <Navigate to="/admin" replace />;
  }
  return children;
};

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route
          path="/"
          element={
            <PreventAdminAccess>
              <Home />
            </PreventAdminAccess>
          }
        />
        <Route
          path="/collection"
          element={
            <PreventAdminAccess>
              <Collection />
            </PreventAdminAccess>
          }
        />
        <Route
          path="/about"
          element={
            <PreventAdminAccess>
              <About />
            </PreventAdminAccess>
          }
        />
        <Route
          path="/contact"
          element={
            <PreventAdminAccess>
              <Contact />
            </PreventAdminAccess>
          }
        />
        <Route
          path="/product/:id"
          element={
            <PreventAdminAccess>
              <Product />
            </PreventAdminAccess>
          }
        />
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
      <Route element={<UserRoute />}>
        <Route element={<PublicLayout />}>
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/track-order/:orderId" element={<TrackOrderPage />} />
          <Route path="/paypal" element={<FakePaypal/>} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-item" element={<AddItems />} />
          <Route path="item-list" element={<ListItems />} />
          <Route path="orders" element={<Orders />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
