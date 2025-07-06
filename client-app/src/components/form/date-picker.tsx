import { useEffect } from "react";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.css";
import Label from "./Label";
import { CalenderIcon } from "../../icons";
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
    label,
    defaultDate,
    placeholder,
}: PropsType) {
    useEffect(() => {
        const flatPickr = flatpickr(`#${id}`, {
            mode: mode || "single",
            static: true,
            monthSelectorType: "static",
            // dateFormat: "Y-m-d",
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
        <div>
            {label && <Label htmlFor={id}>{label}</Label>}

            <div className="relative">
                <input
                    id={id}
                    placeholder={placeholder}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3  dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30  bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700  dark:focus:border-brand-800"
                />

                <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                    <CalenderIcon className="size-6" />
                </span>
            </div>
        </div>
    );
}

// components / DatePicker.tsx;

// import { useEffect } from "react";
// import flatpickr from "flatpickr";
// import "flatpickr/dist/flatpickr.css";
// import { parse, format, isValid } from "date-fns";
// import Label from "./Label";
// import { CalenderIcon } from "../../icons";
// import Hook = flatpickr.Options.Hook;
// import DateOption = flatpickr.Options.DateOption;

// type PropsType = {
//     id: string;
//     mode?: "single" | "multiple" | "range" | "time";
//     onChange?: (selectedDates: Date[]) => void;
//     defaultDate?: string; // ISO string: yyyy-MM-dd
//     label?: string;
//     placeholder?: string;
// };

// export default function DatePicker({
//     id,
//     mode,
//     onChange,
//     defaultDate,
//     label,
//     placeholder,
// }: PropsType) {
//     useEffect(() => {
//         let formattedDefaultDate: string | undefined;

//         // Parse yyyy-MM-dd → dd-MM-yyyy for flatpickr display
//         if (defaultDate) {
//             const parsed = parse(defaultDate, "yyyy-MM-dd", new Date());
//             if (isValid(parsed)) {
//                 formattedDefaultDate = format(parsed, "dd-MM-yyyy");
//             }
//         }

//         const picker = flatpickr(`#${id}`, {
//             mode: mode || "single",
//             static: true,
//             dateFormat: "d-m-Y", // dd-MM-yyyy
//             defaultDate: formattedDefaultDate,
//             onChange: (selectedDates) => {
//                 if (onChange) {
//                     onChange(selectedDates as Date[]);
//                 }
//             },
//         });

//         return () => {
//             if (!Array.isArray(picker)) {
//                 picker.destroy();
//             }
//         };
//     }, [mode, onChange, id, defaultDate]);

//     return (
//         <div>
//             {label && <Label htmlFor={id}>{label}</Label>}

//             <div className="relative">
//                 <input
//                     id={id}
//                     placeholder={placeholder}
//                     className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
//                 />
//                 <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
//                     <CalenderIcon className="size-6" />
//                 </span>
//             </div>
//         </div>
//     );
// }
