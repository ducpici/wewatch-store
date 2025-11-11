import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { Input } from "../ui/input";
import Hook = flatpickr.Options.Hook;
import DateOption = flatpickr.Options.DateOption;

type PropsType = {
  id: string;
  mode?: "single" | "multiple" | "range" | "time";
  onChange?: Hook | Hook[];
  defaultDate?: DateOption;
  label?: string;
  placeholder?: string;
};

export default function DatePicker({
  id,
  mode,
  onChange,
  defaultDate,
  placeholder,
}: PropsType) {
  useEffect(() => {
    const flatPickr = flatpickr(`#${id}`, {
      mode: mode || "single",
      static: true,
      monthSelectorType: "static",
      dateFormat: "d-m-Y",
      defaultDate,
      onChange,
    });

    return () => {
      if (!Array.isArray(flatPickr)) {
        flatPickr.destroy();
      }
    };
  }, [mode, onChange, id, defaultDate]);

  return (
    <div className="relative">
      <Input id={id} placeholder={placeholder} />
    </div>
  );
}
// import { useEffect, useRef } from "react";
// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.css";
// import { Input } from "../ui/input";

// // mở rộng type cho TS biết
// declare global {
//   interface HTMLInputElement {
//     _flatpickr?: flatpickr.Instance;
//   }
// }

// type PropsType = {
//   value?: string | Date;
//   onChange?: (value: string) => void;
//   placeholder?: string;
//   mode?: "single" | "multiple" | "range" | "time";
// };

// export default function DatePicker({
//   value,
//   onChange,
//   placeholder,
//   mode = "single",
// }: PropsType) {
//   const inputRef = useRef<HTMLInputElement | null>(null);

//   useEffect(() => {
//     if (!inputRef.current) return;

//     // Gắn flatpickr trực tiếp vào ref (thay vì selector)
//     const fp = flatpickr(inputRef.current, {
//       mode,
//       static: true,
//       dateFormat: "d-m-Y",
//       defaultDate: value ? new Date(value) : undefined,
//       onChange: (selectedDates) => {
//         if (onChange && selectedDates[0]) {
//           const formatted = selectedDates[0].toISOString().split("T")[0];
//           onChange(formatted);
//         }
//       },
//     });

//     return () => fp.destroy();
//   }, [mode, onChange]);

//   useEffect(() => {
//     if (inputRef.current && inputRef.current._flatpickr && value) {
//       inputRef.current._flatpickr.setDate(new Date(value), false);
//     }
//   }, [value]);

//   return (
//     <div className="relative">
//       <Input
//         ref={inputRef}
//         placeholder={placeholder || "dd-mm-yyyy"}
//         readOnly
//       />
//     </div>
//   );
// }
