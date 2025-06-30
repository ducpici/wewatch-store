// import { format } from "date-fns";
// export default function formatDate(string_date: string) {
//     const inputDate = new Date(string_date);
//     const formatted = format(inputDate, "yyyy-MM-dd");
//     return formatted;
// }

// import { parse, format } from "date-fns";

// export default function formatDate(
//     string_date: string,
//     old_format: string,
//     new_format: string
// ) {
//     const input = string_date;
//     const parsed = parse(input, old_format, new Date());
//     const output = format(parsed, new_format);
//     console.log(old_format);
//     return output;
// }

// import { parse, format } from "date-fns";

// export default function formatDate(
//     input: string,
//     fromFormat: string,
//     toFormat: string
// ): string {
//     const parsed = parse(input, fromFormat, new Date());
//     return format(parsed, toFormat);
// }

import { parse, format, isValid } from "date-fns";

export default function formatDate(
    string_date: string,
    old_format: string,
    new_format: string
): string {
    try {
        const parsed = parse(string_date, old_format, new Date());

        if (!isValid(parsed)) {
            // console.warn("⛔️ Invalid date input:", string_date);
            return "";
        }

        return format(parsed, new_format);
    } catch (err) {
        // console.error("❌ formatDate error:", err);
        return "";
    }
}
