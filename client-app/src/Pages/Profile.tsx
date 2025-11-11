import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ComponentCard from "@/components/common/ComponentCard";
import Radio from "@/components/form/input/Radio";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import DatePicker from "@/components/form/date-picker";
import formatDate from "@/libs/formatDate";
import axios from "@/libs/axiosConfig";
import { toast } from "react-toastify";
import useSession from "@/hooks/useSession";
import { isValidEmail } from "@/libs/validationEmail";
import { isValidName } from "@/libs/validateName";
import { isValidPhoneNum } from "@/libs/validatePhoneNum";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { User, Account } from "@/types/user";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

const breadcrumbItems = [
  { label: "Trang chủ", path: "/" },
  { label: "Thông tin cá nhân" },
];

const initialUser: User = {
  id: 0,
  name: "",
  dob: "",
  gender: "",
  email: "",
  address: "",
  phone_number: "",
  username: "",
  password: "",
  state: true,
};

const profileSchema = z.object({
  id: z.number(),
  name: z.string().min(2, "Vui lòng nhập họ tên"),
  email: z.string().min(1, "Vui lòng nhập email").email("Email không hợp lệ"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  gender: z.string("Vui lòng chọn giới tính"),
  dob: z.string("Vui lòng chọn ngày sinh"),
  phone_number: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^\d{10}$/, "Số điện thoại phải gồm đúng 10 chữ số"),
  state: z.boolean(),
  username: z.string(),
});
const passwordSchema = z.object({
  old_pass: z
    .string()
    .min(1, "Nhập mật khẩu cũ")
    .min(6, "Mật khẩu cũ phải ít nhất 6 ký tự"),
  new_pass: z
    .string()
    .min(1, "Nhập mật khẩu mới")
    .min(6, "Mật khẩu mới phải ít nhất 6 ký tự"),
});

export default function Profile() {
  const { user, updateSession } = useSession();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<User>(initialUser);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
  });
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      old_pass: "",
      new_pass: "",
    },
  });

  useEffect(() => {
    if (userData) {
      profileForm.reset({
        ...userData,
        gender: String(userData.gender ?? "1"),
        // dob: new Date(userData.dob),
      });
    }
  }, [userData, profileForm]);

  const handleUpdateUser = async (values: z.infer<typeof profileSchema>) => {
    console.log("test");
    try {
      // 👇 Gọi API kiểm tra email và username
      const { email, id } = values;
      const { data } = await axios.get("/users/check", {
        params: {
          email,
          id,
        },
      });
      if (data.emailExists) {
        toast.error("Email đã được sử dụng!");
        return;
      }
      if (data.usernameExists) {
        toast.error("Username đã tồn tại!");
        return;
      }
      const payload = {
        ...values,
        gender: Number(values.gender),
      };
      await axios.put(`/users/${userData.id}`, payload);
      toast.success("Cập nhật thành công!");
      // ✅ Cập nhật luôn session
      updateSession({
        id: user?.id,
        username: userData.username,
        name: userData.name,
        email: userData.email,
      });
      navigate("/");
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      toast.error("Cập nhật thất bại.");
    }
  };

  const handleUpdatePassword = async (
    values: z.infer<typeof passwordSchema>
  ) => {
    try {
      const payload = {
        id: user?.id,
        old_pass: values.old_pass.split(" ").join("").trim(),
        new_pass: values.new_pass.split(" ").join("").trim(),
      };

      const res = await axios.put("/users/change-password", payload);

      toast.success(res.data.message);
      passwordForm.reset({
        old_pass: "",
        new_pass: "",
      });
    } catch (error: any) {
      const msg =
        error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu";
      toast.error(msg);
      console.error("Lỗi đổi mật khẩu:", error);
    }
  };

  useEffect(() => {
    if (!user?.id) return;
    axios
      .get(`/users/${user?.id}`)
      .then((response) => {
        const user = response.data[0];
        setUserData(user);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {});
  }, [user?.id]); // chỉ gọi lại khi id thay đổi
  return (
    <div className="container md:max-w-6xl m-auto px-2">
      <PageBreadcrumb items={breadcrumbItems} />
      <div className="space-y-2">
        <div className="flex">
          <button
            className={`cursor-pointer px-2 py-3 md:px-6 md:py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "info"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("info")}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`cursor-pointer px-2 py-3 md:px-6 md:py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "account"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("account")}
          >
            Đổi mật khẩu
          </button>
        </div>
        {activeTab === "account" && (
          <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)}>
            <div className="space-y-2">
              <div>
                <ComponentCard title="Thông tin tài khoản">
                  <div>
                    <Controller
                      name="username"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="form-rhf-username">
                            Tên đăng nhập:
                          </FieldLabel>
                          <Input
                            {...field}
                            disabled
                            id="form-rhf-name"
                            aria-invalid={fieldState.invalid}
                            autoComplete="off"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div>
                    <Controller
                      name="old_pass"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="form-rhf-old_pass">
                            Mật khẩu cũ:
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="form-rhf-old_pass"
                              type={showPassword ? "text" : "password"}
                              aria-invalid={fieldState.invalid}
                              placeholder="Nhập mật khẩu cũ"
                              autoComplete="off"
                              onChange={(e) => field.onChange(e.target.value)}
                            />{" "}
                            <span
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                              {showPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                              ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                              )}
                            </span>
                          </div>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="new_pass"
                      control={passwordForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="form-rhf-new_pass">
                            Mật khẩu mới:
                          </FieldLabel>
                          <div className="relative">
                            <Input
                              {...field}
                              id="form-rhf-new_pass"
                              type={showNewPassword ? "text" : "password"}
                              aria-invalid={fieldState.invalid}
                              placeholder="Nhập mật mới"
                              autoComplete="off"
                              onChange={(e) => field.onChange(e.target.value)}
                            />{" "}
                            <span
                              onClick={() =>
                                setShowNewPassword(!showNewPassword)
                              }
                              className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                            >
                              {showNewPassword ? (
                                <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                              ) : (
                                <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                              )}
                            </span>
                          </div>

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </ComponentCard>
              </div>
              <div className="w-full flex items-center justify-center">
                <Button type="submit" className="cursor-pointer font-semibold">
                  Cập nhật
                </Button>
              </div>
            </div>
          </form>
        )}
        {activeTab === "info" && (
          <form onSubmit={profileForm.handleSubmit(handleUpdateUser)}>
            <div className="space-y-2">
              <div className="profile grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
                <ComponentCard title="Thông tin cá nhân">
                  <Controller
                    name="name"
                    control={profileForm.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="gap-2"
                      >
                        <FieldLabel htmlFor="form-rhf-username">
                          Họ tên:
                        </FieldLabel>
                        <Input
                          {...field}
                          id="form-rhf-name"
                          aria-invalid={fieldState.invalid}
                          placeholder="Nhập họ tên"
                          autoComplete="off"
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                  <div>
                    <Controller
                      name="dob"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="date">Ngày sinh:</FieldLabel>
                          <DatePicker
                            id="date-picker"
                            placeholder="Chọn ngày sinh"
                            defaultDate={new Date(field.value)}
                            onChange={(_, dateStr) =>
                              field.onChange(
                                formatDate(dateStr, "dd-MM-yyyy", "yyyy-MM-dd")
                              )
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  {/* <div className="flex flex-col gap-3">
                    <Label htmlFor="date">Date of birth</Label>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="w-48 justify-between font-normal"
                        >
                          {date ? date.toLocaleDateString() : "Select date"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="start"
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          onSelect={(date) => {
                            setDate(date);
                            setOpen(false);
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div> */}
                  <div>
                    <Controller
                      name="gender"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel>Giới tính:</FieldLabel>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-4"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="1" id="gender-male" />
                              <Label htmlFor="gender-male">Nam</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="0" id="gender-female" />
                              <Label htmlFor="gender-female">Nữ</Label>
                            </div>
                          </RadioGroup>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </ComponentCard>
                <ComponentCard title="Thông tin liên hệ">
                  <div>
                    <Controller
                      name="email"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="form-rhf-email">
                            Email:
                          </FieldLabel>
                          <Input
                            {...field}
                            id="form-rhf-email"
                            aria-invalid={fieldState.invalid}
                            placeholder="Nhập email"
                            autoComplete="off"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="phone_number"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="form-rhf-phone">
                            Số điện thoại:
                          </FieldLabel>
                          <Input
                            {...field}
                            id="form-rhf-phone"
                            aria-invalid={fieldState.invalid}
                            placeholder="Nhập số điện thoại"
                            autoComplete="off"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div>
                    <Controller
                      name="address"
                      control={profileForm.control}
                      render={({ field, fieldState }) => (
                        <Field
                          data-invalid={fieldState.invalid}
                          className="gap-2"
                        >
                          <FieldLabel htmlFor="form-rhf-address">
                            Địa chỉ:
                          </FieldLabel>
                          <Input
                            {...field}
                            id="form-rhf-address"
                            aria-invalid={fieldState.invalid}
                            placeholder="Nhập địa chỉ"
                            autoComplete="off"
                            onChange={(e) => field.onChange(e.target.value)}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </ComponentCard>
              </div>

              <div className="w-full flex items-center justify-center">
                <Button type="submit" className="cursor-pointer font-semibold">
                  Cập nhật
                </Button>
              </div>
            </div>
          </form>
        )}
        {/* <div className="w-full flex items-center justify-center">
          <Button
            className=" cursor-pointer font-semibold"
            onClick={
              activeTab == "info" ? handleUpdateUser : handleUpdatePassword
            }
          >
            Cập nhật
          </Button>
        </div> */}
      </div>
    </div>
  );
}
