import "/public/styles/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./components/layouts/AppLayout";
import Home from "./Pages/Home";
import ProductDetail from "./Pages/ProductDetail";
import Cart from "./Pages/Cart";
import SignIn from "./auth/SignIn";
import SignUp from "./auth/SignUp";
import Brand from "./Pages/Brand";
import Category from "./Pages/Category";
import { ToastContainer } from "react-toastify";
import Order from "./Pages/Order/Order";
import OrderDetail from "./Pages/Order/OrderDetail";
import Profile from "./Pages/Profile";
import Checkout from "./Pages/Checkout";
import AddressList from "./Pages/AddressList";
import AddAddress from "./Pages/Address/AddAddress";
import EditAddress from "./Pages/Address/EditAddress";
import SearchResult from "./Pages/SearchResult";
import UserVoucher from "./Pages/UserVoucher";
import ShopVoucher from "./Pages/ShopVoucher.";
import Contact from "./Pages/Contact";
import AboutPage from "./Pages/AboutPage";
function App() {
    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route element={<AppLayout />}>
                    <Route index path="/" element={<Home />} />
                    <Route path="/thuong-hieu/:slug" element={<Brand />} />
                    <Route path="/danh-muc/:slug" element={<Category />} />
                    <Route path="/san-pham/:slug" element={<ProductDetail />} />
                    <Route path="/gio-hang" element={<Cart />} />
                    <Route path="/thong-tin-ca-nhan" element={<Profile />} />
                    <Route path="/don-hang" element={<Order />} />
                    <Route path="/dat-hang" element={<Checkout />} />
                    <Route
                        path="/danh-sach-dia-chi"
                        element={<AddressList />}
                    />
                    <Route path="/them-dia-chi" element={<AddAddress />} />
                    <Route path="/cap-nhat-dia-chi" element={<EditAddress />} />
                    <Route path="/don-hang" element={<Order />} />
                    <Route
                        path="/don-hang/chi-tiet/:id"
                        element={<OrderDetail />}
                    />
                    <Route path="/tim-kiem" element={<SearchResult />} />
                    <Route
                        path="/khuyen-mai-cua-toi"
                        element={<UserVoucher />}
                    />
                    <Route path="/khuyen-mai" element={<ShopVoucher />} />
                    <Route path="/lien-he" element={<Contact />} />
                    <Route path="/gioi-thieu" element={<AboutPage />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
