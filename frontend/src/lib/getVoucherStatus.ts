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

    if (start.isAfter(now)) {
        return 4; // Chưa bắt đầu
    }

    if (end.isBefore(now)) {
        return 2; // Hết hạn
    }

    if (quantity > 0 && usedCount >= quantity) {
        return 3; // Đã dùng hết
    }

    return 1; // Hoạt động
}

export default getVoucherStatus;
