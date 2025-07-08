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

function formatDateToVietnamese(input) {
    const date = new Date(input);
    // Chuyển sang múi giờ Việt Nam (UTC+7)
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    const day = vnDate.getDate().toString().padStart(2, "0");
    const month = vnDate.getMonth() + 1;
    const year = vnDate.getFullYear();

    let hours = vnDate.getHours();
    const minutes = vnDate.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${day} tháng ${month} năm ${year}, ${hours}:${minutes} ${ampm}`;
}

module.exports = { formatDate, formatDate2, formatDateTime };
