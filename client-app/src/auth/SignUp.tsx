import { useState } from "react";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { Button } from "@/components/ui/button";
import axios from "@/libs/axiosConfig";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { isValidUsername, isValidPassword } from "@/libs/validateData";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
const signUpSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập tên đăng nhập"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  type: z.string(),
});
export default function SignUp() {
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      type: "user",
    },
  });
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (data: z.infer<typeof signUpSchema>) => {
    if (!isValidUsername(data.username)) {
      toast.error("Tên đăng nhập không hợp lệ");
      return;
    }

    if (!isValidPassword(data.password)) {
      toast.error("Mật khẩu không hợp lệ");
      return;
    }

    try {
      let res = await axios.post("/signup", data);
      console.log(res);
      toast.success(res.data.message);
      navigate("/signin");
    } catch (err: any) {
      if (err.response) {
        // Khi server trả về mã lỗi như 401, 403, 500...
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
    <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto h-200 px-2">
      <div className="flex justify-center p-2">
        <img src="/images/mylogo.png" className="w-20" />
      </div>
      <Card className="w-full sm:max-w-md">
        <CardHeader>
          <CardTitle>Đăng ký</CardTitle>
          <CardDescription>
            Nhập tên đăng nhập và mật khẩu để đăng ký một tài khoản mới
          </CardDescription>
          <CardAction>
            <Button variant="link" onClick={() => navigate("/signin")}>
              Đăng nhập
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-signin" onSubmit={form.handleSubmit(handleSignUp)}>
            <FieldGroup>
              <Controller
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="form-rhf-username">
                      Tên đăng nhập
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-username"
                      aria-invalid={fieldState.invalid}
                      placeholder="Nhập tên đăng nhập"
                      autoComplete="off"
                      onChange={(e) =>
                        field.onChange(e.target.value.toLowerCase())
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="gap-2">
                    <FieldLabel htmlFor="form-rhf-password">
                      Mật khẩu
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        {...field}
                        id="form-rhf-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        aria-invalid={fieldState.invalid}
                        onChange={(e) =>
                          field.onChange(e.target.value.toLowerCase())
                        }
                      />
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
            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="vertical">
            <Button type="submit" form="form-rhf-signin">
              Đăng ký
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/")}
            >
              Quay về trang chủ
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
