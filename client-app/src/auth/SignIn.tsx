import { useState, useRef } from "react";
import { Link } from "react-router";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "../icons";
import Input from "../components/form/input/InputField";
import Label from "../components/form/Label";
import Button from "../components/ui/button/Button";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isValidUsername, isValidPassword } from "../libs/validateData";
export default function SignIn() {
    const { login } = useAuth();
    const navigate = useNavigate();
    type Account = {
        username: string;
        password: string;
        type: string;
    };
    const [data, setData] = useState<Account>({
        username: "",
        password: "",
        type: "user",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const authLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.username) {
            toast.error("Vui lòng nhập tên đăng nhập");
            usernameRef.current?.focus();
            return;
        }

        if (!isValidUsername(data.username)) {
            toast.error("Tên đăng nhập không hợp lệ");
            return;
        }
        if (data.password.length < 6) {
            toast.error("Mật khẩu phải từ 6 ký tự trở lên");
            return;
        }
        if (!isValidPassword(data.password)) {
            toast.error("Mật khẩu không hợp lệ");
            return;
        }

        if (!data.password) {
            toast.error("Vui lòng nhập mật khẩu");
            passwordRef.current?.focus();
            return;
        }

        try {
            let res = await axios.post("/login", data);
            login(res.data.user, res.data.token);
            toast.success(res.data.message);
            navigate("/");
        } catch (err: any) {
            if (err.response) {
                const msg = err.response.data?.message || "Đã có lỗi xảy ra";
                toast.error(msg);
                console.error("Lỗi server:", err.response);
            } else {
                toast.error("Không thể kết nối tới máy chủ");
                console.error("Lỗi kết nối:", err);
            }
        } finally {
        }
    };
    return (
        <>
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto h-200">
                <div className="p-4 border border-gray-300 rounded-2xl">
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Đăng nhập
                        </h1>
                    </div>
                    <div>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"></div>
                        <form onSubmit={authLogin}>
                            <div className="space-y-6">
                                <div>
                                    <Label>
                                        Tên đăng nhập{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <Input
                                        ref={usernameRef}
                                        placeholder="Nhập tên đăng nhập"
                                        value={data.username}
                                        onChange={(e) =>
                                            setData({
                                                ...data,
                                                username:
                                                    e.target.value.toLowerCase(),
                                            })
                                        }
                                    />
                                </div>
                                <div>
                                    <Label>
                                        Mật khẩu{" "}
                                        <span className="text-error-500">
                                            *
                                        </span>{" "}
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            ref={passwordRef}
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            placeholder="Nhập mật khẩu"
                                            onChange={(e) =>
                                                setData({
                                                    ...data,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                        <span
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                                        >
                                            {showPassword ? (
                                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            ) : (
                                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between"></div>
                                <div>
                                    <Button
                                        className="w-full bg-blue-500 cursor-pointer"
                                        size="sm"
                                        // onClick={authLogin}
                                    >
                                        Đăng nhập
                                    </Button>
                                </div>
                            </div>
                        </form>

                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Chưa có tài khoản ? {""}
                                <Link
                                    to="/signup"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Đăng ký
                                </Link>
                            </p>
                        </div>
                        <div className="w-full max-w-md pt-10 mx-auto">
                            <Link
                                to="/"
                                className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                <ChevronLeftIcon className="size-5" />
                                Quay về trang chủ
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
