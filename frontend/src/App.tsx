import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
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

                            {/* Others Page */}
                            <Route path="/profile" element={<UserProfiles />} />
                            <Route path="/calendar" element={<Calendar />} />
                            <Route path="/blank" element={<Blank />} />

                            {/* Forms */}
                            <Route
                                path="/form-elements"
                                element={<FormElements />}
                            />

                            {/* Tables */}
                            <Route
                                path="/basic-tables"
                                element={<BasicTables />}
                            />

                            {/* Ui Elements */}
                            <Route path="/alerts" element={<Alerts />} />
                            <Route path="/avatars" element={<Avatars />} />
                            <Route path="/badge" element={<Badges />} />
                            <Route path="/buttons" element={<Buttons />} />
                            <Route path="/images" element={<Images />} />
                            <Route path="/videos" element={<Videos />} />

                            {/* Charts */}
                            <Route path="/line-chart" element={<LineChart />} />
                            <Route path="/bar-chart" element={<BarChart />} />

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
