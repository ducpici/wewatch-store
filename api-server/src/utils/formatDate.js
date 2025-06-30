import { format } from "date-fns";

const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
    // return `${year}-${month}-${day}`;
};

const formatDate2 = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = d.getFullYear();
    // return `${day}-${month}-${year}`;
    return `${year}-${month}-${day}`;
};

function formatDateTime(inputDate) {
    try {
        const date =
            typeof inputDate === "string" ? new Date(inputDate) : inputDate;
        return format(date, "dd-MM-yyyy HH:mm:ss");
    } catch (error) {
        console.error("Invalid date:", inputDate);
        return "";
    }
}

module.exports = { formatDate, formatDate2, formatDateTime };
