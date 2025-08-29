import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";

import Users from "./pages/Users";
import AddUser from "./pages/User/AddUser";
import UpdateUser from "./pages/User/UpdateUser";

import Employees from "./pages/Employee/Employees";
import AddEmployee from "./pages/Employee/AddEmployee";
import EditEmployee from "./pages/Employee/EditEmployee";

import Positions from "./pages/Position/Positions";
import AddPosition from "./pages/Position/AddPossition";
import EditPosition from "./pages/Position/EditPosition";

import Brands from "./pages/Brand/Brands";
import AddBrand from "./pages/Brand/AddBrand";
import EditBrand from "./pages/Brand/EditBrand";

import Categories from "./pages/Category/Categories";
import AddCategory from "./pages/Category/AddCategory";
import EditCategory from "./pages/Category/EditCategory";

import Functions from "./pages/Function/Functions";
import AddFunction from "./pages/Function/AddFunction";
import EditFunction from "./pages/Function/EditFunction";

import Roles from "./pages/Role/Roles";
import AddRole from "./pages/Role/AddRole";
import EditRole from "./pages/Role/EditRole";
import AuthorPosition from "./pages/Position/AuthPossition";

import Vouchers from "./pages/Voucher/Vouchers";
import AddVoucher from "./pages/Voucher/AddVoucher";
import EditVoucher from "./pages/Voucher/EditVoucher";

import Banners from "./pages/Banner/Banners";
import AddBanner from "./pages/Banner/AddBanner";
import EditBanner from "./pages/Banner/EditBanner";

import Products from "./pages/Product/Products";
import AddProduct from "./pages/Product/AddProduct";
import EditProduct from "./pages/Product/EditProduct";

import Orders from "./pages/Order/Orders";
import OrderDetail from "./pages/Order/OrderDetail";

import { ToastContainer } from "react-toastify";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
    return (
        <>
            <Router>
                <ScrollToTop />
                <ToastContainer style={{ top: "80px" }} />
                <Routes>
                    <Route element={<PrivateRoute />}>
                        {/* Dashboard Layout */}
                        <Route element={<AppLayout />}>
                            <Route index path="/" element={<Home />} />

                            {/* Users */}
                            <Route path="/users" element={<Users />} />
                            <Route
                                path="/users/add-user"
                                element={<AddUser />}
                            />
                            <Route
                                path="/users/edit-user/:id"
                                element={<UpdateUser />}
                            />

                            {/* Employees */}
                            <Route path="/employees" element={<Employees />} />
                            <Route
                                path="/employees/add-new"
                                element={<AddEmployee />}
                            />
                            <Route
                                path="/employees/edit/:id"
                                element={<EditEmployee />}
                            />

                            {/* Positions */}
                            <Route path="/positions" element={<Positions />} />
                            <Route
                                path="/positions/add-new"
                                element={<AddPosition />}
                            />
                            <Route
                                path="/positions/edit/:id"
                                element={<EditPosition />}
                            />
                            <Route
                                path="/positions/authorization/:id"
                                element={<AuthorPosition />}
                            />

                            {/* Brands */}
                            <Route path="/brands" element={<Brands />} />
                            <Route
                                path="/brands/add-new"
                                element={<AddBrand />}
                            />
                            <Route
                                path="/brands/edit/:id"
                                element={<EditBrand />}
                            />

                            {/* Categories */}
                            <Route
                                path="/categories"
                                element={<Categories />}
                            />
                            <Route
                                path="/categories/add-new"
                                element={<AddCategory />}
                            />
                            <Route
                                path="/categories/edit/:id"
                                element={<EditCategory />}
                            />

                            {/* Functions */}
                            <Route path="/functions" element={<Functions />} />
                            <Route
                                path="/functions/add-new"
                                element={<AddFunction />}
                            />
                            <Route
                                path="/functions/edit/:id"
                                element={<EditFunction />}
                            />

                            {/* Roles */}
                            <Route path="/roles" element={<Roles />} />
                            <Route
                                path="/roles/add-new"
                                element={<AddRole />}
                            />
                            <Route
                                path="/roles/edit/:id"
                                element={<EditRole />}
                            />

                            {/* Vouchers */}
                            <Route path="/vouchers" element={<Vouchers />} />
                            <Route
                                path="/vouchers/add-new"
                                element={<AddVoucher />}
                            />
                            <Route
                                path="/vouchers/edit/:id"
                                element={<EditVoucher />}
                            />

                            {/* Banners */}
                            <Route path="/banners" element={<Banners />} />
                            <Route
                                path="/banners/add-new"
                                element={<AddBanner />}
                            />
                            <Route
                                path="/banners/edit/:id"
                                element={<EditBanner />}
                            />

                            {/* Products */}
                            <Route path="/products" element={<Products />} />
                            <Route
                                path="/products/add-new"
                                element={<AddProduct />}
                            />
                            <Route
                                path="/products/edit/:id"
                                element={<EditProduct />}
                            />
                            <Route path="/profile" element={<UserProfiles />} />
                            <Route path="/orders" element={<Orders />} />
                            <Route
                                path="/orders/detail/:id"
                                element={<OrderDetail />}
                            />
                        </Route>
                    </Route>

                    {/* Auth Layout */}
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />

                    {/* Fallback Route */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </>
    );
}
