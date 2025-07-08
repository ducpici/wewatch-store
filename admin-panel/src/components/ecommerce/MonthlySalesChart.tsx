import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import axios from "../../lib/axiosConfig";

type SeriesType = {
    name: string;
    data: number[];
}[];

export default function MonthlySalesChart() {
    const [years, setYears] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [series, setSeries] = useState<SeriesType>([
        { name: "Số đơn", data: Array(12).fill(0) },
    ]);

    // Lấy danh sách năm từ backend
    useEffect(() => {
        axios
            .get("/reports/order-years")
            .then((res) => {
                setYears(res.data.data);
                if (!res.data.data.includes(selectedYear)) {
                    setSelectedYear(res.data.data[0]); // fallback nếu năm hiện tại không có
                }
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách năm:", err);
            });
    }, []);

    // Lấy dữ liệu thống kê theo năm
    useEffect(() => {
        axios
            .get(`/reports/monthly-sales?year=${selectedYear}`)
            .then((res) => {
                const newData = res.data.data;
                setSeries([{ name: "Số đơn", data: newData }]);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy dữ liệu biểu đồ:", err);
                setSeries([{ name: "Số đơn", data: Array(12).fill(0) }]);
            });
    }, [selectedYear]);

    const options: ApexOptions = {
        colors: ["#465fff"],
        chart: {
            fontFamily: "Outfit, sans-serif",
            type: "bar",
            height: 180,
            toolbar: { show: false },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "39%",
                borderRadius: 5,
                borderRadiusApplication: "end",
            },
        },
        dataLabels: { enabled: false },
        stroke: {
            show: true,
            width: 4,
            colors: ["transparent"],
        },
        xaxis: {
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
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontFamily: "Outfit",
        },
        yaxis: {
            labels: {
                formatter: (val: number) => val.toLocaleString("vi-VN"),
            },
            title: { text: undefined },
        },
        grid: {
            yaxis: {
                lines: { show: true },
            },
        },
        fill: { opacity: 1 },
        tooltip: {
            x: { show: false },
            y: {
                formatter: (val: number) =>
                    `${val.toLocaleString("vi-VN")} đơn`,
            },
        },
    };

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                    Đơn hàng mỗi tháng
                </h3>
                <div className="flex items-center gap-2">
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

            <div className="max-w-full overflow-x-auto custom-scrollbar">
                <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
                    <Chart
                        options={options}
                        series={series}
                        type="bar"
                        height={180}
                    />
                </div>
            </div>
        </div>
    );
}
