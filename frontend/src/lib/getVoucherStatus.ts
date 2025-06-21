import dayjs from "dayjs";

function getVoucherStatus(
    startDate: string,
    endDate: string,
    quantity: number,
    usedCount: number
): number {
    const now = dayjs();
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // Trường hợp ngày bắt đầu = ngày kết thúc
    if (start.isSame(end, "day")) {
        if (now.isBefore(start)) {
            return 4; // Chưa bắt đầu
        }
        if (now.isAfter(end.endOf("day"))) {
            return 2; // Hết hạn
        }
        // Trong cùng ngày
        if (quantity > 0 && usedCount >= quantity) {
            return 3; // Đã dùng hết
        }
        return 1; // Hoạt động
    }

    // Ngày bắt đầu > hiện tại
    if (start.isAfter(now)) {
        return 4; // Chưa bắt đầu
    }

    // Ngày kết thúc < hiện tại
    if (end.isBefore(now)) {
        return 2; // Hết hạn
    }

    if (quantity > 0 && usedCount >= quantity) {
        return 3; // Đã dùng hết
    }

    return 1; // Hoạt động
}

export default getVoucherStatus;
