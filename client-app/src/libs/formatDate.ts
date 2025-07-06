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
