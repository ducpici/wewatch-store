import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axios from "../../lib/axiosConfig";

export default function StatisticsChart() {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [series, setSeries] = useState([
        { name: "Số đơn", data: Array(12).fill(0) },
        { name: "Doanh thu", data: Array(12).fill(0) },
    ]);

    // Lấy danh sách năm từ backend
    useEffect(() => {
        axios
            .get("/reports/order-years")
            .then((res) => {
                const yearList = res.data.data;
                setYears(yearList);
                if (!yearList.includes(selectedYear)) {
                    setSelectedYear(yearList[0]); // fallback nếu năm hiện tại không có
                }
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách năm:", err);
            });
    }, []);

    // Gọi API theo năm khi selectedYear thay đổi
    useEffect(() => {
        axios
            .get(`/reports/monthly-statistics?year=${selectedYear}`)
            .then((res) => {
                const stats = res.data.data;
                const sales = Array(12).fill(0);
                const revenue = Array(12).fill(0);

                stats.forEach((item: any) => {
                    sales[item.month - 1] = item.order_count;
                    revenue[item.month - 1] = item.total_revenue;
                });

                setSeries([
                    { name: "Số đơn", data: sales },
                    { name: "Doanh thu", data: revenue },
                ]);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy dữ liệu thống kê:", err);
                setSeries([
                    { name: "Số đơn", data: Array(12).fill(0) },
                    { name: "Doanh thu", data: Array(12).fill(0) },
                ]);
            });
    }, [selectedYear]);

    const options: ApexOptions = {
        legend: {
            show: false,
            position: "top",
            horizontalAlign: "left",
        },
        colors: ["#465FFF", "#9CB9FF"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            height: 310,
            type: "line",
            toolbar: { show: false },
        },
        stroke: {
            curve: "straight",
            width: [2, 2],
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        markers: {
            size: 0,
            strokeColors: "#fff",
            strokeWidth: 2,
            hover: { size: 6 },
        },
        grid: {
            xaxis: { lines: { show: false } },
            yaxis: { lines: { show: true } },
        },
        dataLabels: { enabled: false },
        tooltip: {
            enabled: true,
            x: { show: false },
            y: {
                formatter: (val, { seriesIndex }) => {
                    if (seriesIndex === 1) {
                        return val.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                        });
                    }
                    return val.toLocaleString("vi-VN");
                },
            },
        },
        xaxis: {
            type: "category",
            categories: [
                "Tháng 1",
                "Tháng 2",
                "Tháng 3",
                "Tháng 4",
                "Tháng 5",
                "Tháng 6",
                "Tháng 7",
                "Tháng 8",
                "Tháng 9",
                "Tháng 10",
                "Tháng 11",
                "Tháng 12",
            ],
            axisBorder: { show: false },
            axisTicks: { show: false },
            tooltip: { enabled: false },
        },
        yaxis: {
            labels: {
                style: { fontSize: "12px", colors: ["#6B7280"] },
                formatter: (val: number, { seriesIndex }: any) => {
                    if (seriesIndex === 1) {
                        return val.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                            maximumFractionDigits: 0,
                        });
                    }
                    return val.toLocaleString("vi-VN");
                },
            },
            title: { text: "", style: { fontSize: "0px" } },
        },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div className="w-full flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Thống kê
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <label
                            htmlFor="yearSelect"
                            className="text-sm text-gray-600"
                        >
                            Năm:
                        </label>
                        <select
                            id="yearSelect"
                            className="px-2 py-1 border rounded-md"
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(Number(e.target.value))
                            }
                        >
                            {years.map((year) => (
                                <option key={year} value={year}>
                                    {year}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="min-w-[1000px] xl:min-w-full">
                    <Chart
                        options={options}
                        series={series}
                        type="area"
                        height={310}
                    />
                </div>
            </div>
        </div>
    );
}
