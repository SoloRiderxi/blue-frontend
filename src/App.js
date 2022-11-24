import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SingleProduct from "./pages/SingleProduct";
import Container from "react-bootstrap/Container";
import NavbarComp from "./components/NavbarComp";
import Cart from "./pages/Cart";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import ShippingAddress from "./pages/ShippingAddress";
import PaymentMethod from "./pages/PaymentMethod";
import PlaceOrder from "./pages/PlaceOrder";
import PreviewOrders from "./pages/PreviewOrders";
import OrdersHistory from "./pages/OrdersHistory";
import Profile from "./pages/Profile";
import SearchPage from "./pages/SearchPage";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/AllUsers";
import EditUser from "./pages/EditUser";
import ProductsList from "./pages/ProductsList";
import EditProduct from "./pages/EditProduct";
import AllOrders from "./pages/AllOrders";
import { UserProtectedRoute, AdminRoute } from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter basename="/">
      <div className="d-flex flex-column site-container">
        <ToastContainer position="top-right" limit={1} />
        <header>
          <NavbarComp />
        </header>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<SingleProduct />} />
              <Route path="/shipping" element={<ShippingAddress />} />
              <Route
                path="/profile"
                element={
                  <UserProtectedRoute>
                    {" "}
                    <Profile />{" "}
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <UserProtectedRoute>
                    <PaymentMethod />
                  </UserProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <UserProtectedRoute>
                    <PreviewOrders />
                  </UserProtectedRoute>
                }
              />
              <Route path="/signin" element={<SigninPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/placeorder" element={<PlaceOrder />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/orderhistory"
                element={
                  <UserProtectedRoute>
                    {" "}
                    <OrdersHistory />{" "}
                  </UserProtectedRoute>
                }
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/" element={<Home />} />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    {" "}
                    <Dashboard />{" "}
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/userlist"
                element={
                  <AdminRoute>
                    {" "}
                    <AllUsers />{" "}
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id/edit"
                element={
                  <AdminRoute>
                    {" "}
                    <EditUser />{" "}
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/productlist"
                element={
                  <AdminRoute>
                    {" "}
                    <ProductsList />{" "}
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/product/:id/edit"
                element={
                  <AdminRoute>
                    {" "}
                    <EditProduct />{" "}
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/orderlist"
                element={
                  <AdminRoute>
                    {" "}
                    <AllOrders />{" "}
                  </AdminRoute>
                }
              />
            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center product-details">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
