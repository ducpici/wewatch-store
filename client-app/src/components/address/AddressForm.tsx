import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError } from "@/components/ui/field";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import data from "@/datas/vietnamAddress.json";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const vietnamAddress = data as Province[];

type Ward = {
  Id: string;
  Name: string;
  Level: string;
};
type District = {
  Id: string;
  Name: string;
  Wards: Ward[];
};
type Province = {
  Id: string;
  Name: string;
  Districts: District[];
};

export const addressSchema = z.object({
  id_ship: z.union([z.string(), z.number()]).optional(),
  full_name: z.string().min(1, "Vui lòng nhập họ tên"),
  phone_num: z
    .string()
    .min(1, "Vui lòng nhập số điện thoại")
    .regex(/^\d{10}$/, "Số điện thoại phải gồm đúng 10 chữ số"),
  city: z.string().min(1, "Vui lòng chọn tỉnh/thành phố"),
  district: z.string().min(1, "Vui lòng chọn quận/huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường/xã"),
  detail: z.string(),
  is_default: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>;
  onSubmit: (values: AddressFormValues) => Promise<void> | void;
  submitLabel?: string;
}

export default function AddressForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: AddressFormProps) {
  const [openCity, setOpenCity] = useState(false);
  const [openDistrict, setOpenDistrict] = useState(false);
  const [openWard, setOpenWard] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<District[]>([]);
  const [availableWards, setAvailableWards] = useState<Ward[]>([]);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      ...defaultValues,
    },
  });

  const city = form.watch("city");
  const district = form.watch("district");

  const selectedProvince = vietnamAddress.find((p) => p.Name === city);
  const districts = selectedProvince
    ? selectedProvince.Districts
    : availableDistricts;
  const selectedDistrict = districts.find((d) => d.Name === district);
  const wards = selectedDistrict ? selectedDistrict.Wards : availableWards;

  useEffect(() => {
    if (defaultValues) {
      form.reset(defaultValues);

      // Nếu defaultValues đã có city và district
      const province = vietnamAddress.find(
        (p) => p.Name === defaultValues.city
      );
      const district = province?.Districts.find(
        (d) => d.Name === defaultValues.district
      );

      // Lưu sẵn danh sách quận/huyện và phường/xã để form render được
      setAvailableDistricts(province?.Districts || []);
      setAvailableWards(district?.Wards || []);
    }
  }, [defaultValues, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <input type="hidden" {...form.register("id_ship")} />
      {/* Họ tên */}
      <Controller
        name="full_name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input {...field} placeholder="Nhập họ và tên" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* SĐT */}
      <Controller
        name="phone_num"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Input {...field} placeholder="Nhập số điện thoại" />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Tỉnh/TP */}
      <Controller
        name="city"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Popover open={openCity} onOpenChange={setOpenCity}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {field.value || "Chọn Tỉnh/Thành phố..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm Tỉnh/Thành phố..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {vietnamAddress.map((p) => (
                        <CommandItem
                          key={p.Id}
                          value={p.Name}
                          onSelect={() => {
                            field.onChange(p.Name);
                            form.setValue("district", "");
                            form.setValue("ward", "");
                            setOpenCity(false);
                          }}
                        >
                          {p.Name}
                          <Check
                            className={cn(
                              "ml-auto",
                              city === p.Name ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Quận/Huyện */}
      <Controller
        name="district"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Popover open={openDistrict} onOpenChange={setOpenDistrict}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!city}
                  className="w-full justify-between"
                >
                  {field.value || "Chọn Quận/Huyện..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm Quận/Huyện..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {districts.map((d) => (
                        <CommandItem
                          key={d.Id}
                          value={d.Name}
                          onSelect={() => {
                            field.onChange(d.Name);
                            form.setValue("ward", "");
                            setOpenDistrict(false);
                          }}
                        >
                          {d.Name}
                          <Check
                            className={cn(
                              "ml-auto",
                              district === d.Name ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Phường/Xã */}
      <Controller
        name="ward"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <Popover open={openWard} onOpenChange={setOpenWard}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!district}
                  className="w-full justify-between"
                >
                  {field.value || "Chọn Phường/Xã..."}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Tìm Phường/Xã..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy.</CommandEmpty>
                    <CommandGroup>
                      {wards.map((w) => (
                        <CommandItem
                          key={w.Id}
                          value={w.Name}
                          onSelect={() => {
                            field.onChange(w.Name);
                            setOpenWard(false);
                          }}
                        >
                          {w.Name}
                          <Check
                            className={cn(
                              "ml-auto",
                              field.value === w.Name
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {/* Địa chỉ chi tiết */}
      <Controller
        name="detail"
        control={form.control}
        render={({ field }) => (
          <Input {...field} placeholder="Nhập số nhà / tên đường" />
        )}
      />

      {/* Checkbox */}
      <Controller
        name="is_default"
        control={form.control}
        render={({ field }) => (
          // <div className="flex justify-between items-center">
          //   <span className="text-sm">Đặt làm mặc định</span>
          //   <input
          //     type="checkbox"
          //     checked={field.value}
          //     onChange={(e) => field.onChange(e.target.checked)}
          //     className="w-5 h-5 accent-red-500"
          //   />
          // </div>
          <div className="flex items-center gap-3">
            <Checkbox
              id="is_default"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <Label className="m-0" htmlFor="is_default">
              Đặt làm mặc định
            </Label>
          </div>
        )}
      />

      {/* Submit */}
      <Button type="submit" className="w-full">
        {submitLabel}
      </Button>
    </form>
  );
}
