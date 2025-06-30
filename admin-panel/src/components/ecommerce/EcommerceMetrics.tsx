import {
    ArrowDownIcon,
    ArrowUpIcon,
    BoxIconLine,
    GroupIcon,
} from "../../icons";
import Badge from "../ui/badge/Badge";
import { useEffect, useState } from "react";
import axios from "../../lib/axiosConfig";
interface Metrics {
    customers: number;
    products: number;
    orders: number;
    revenue?: number;
}

export default function EcommerceMetrics() {
    const [metrics, setMetrics] = useState<Metrics>({
        customers: 0,
        products: 0,
        orders: 0,
        revenue: 0, // nếu có
    });
    useEffect(() => {
        axios.get("/metrics").then((res) => {
            const { customers, products, orders, revenue } = res.data.data;
            setMetrics({ customers, products, orders, revenue });
            console.log(res);
        });
    }, []);

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 md:gap-6">
            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Khách hàng
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {metrics.customers ?? 0}
                        </h4>
                    </div>
                    {/* <Badge color="success">
                        <ArrowUpIcon />
                        11.01%
                    </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}

            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Sản phẩm
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {metrics.products ?? 0}
                        </h4>
                    </div>
                    {/* <Badge color="success">
                        <ArrowUpIcon />
                        11.01%
                    </Badge> */}
                </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
                </div>

                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Đơn hàng
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {metrics.orders ?? 0}
                        </h4>
                    </div>
                    {/* <Badge color="success">
                        <ArrowUpIcon />
                        11.01%
                    </Badge> */}
                </div>
            </div>

            {/* <!-- Metric Item Start --> */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                    <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
                </div>
                <div className="flex items-end justify-between mt-5">
                    <div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Tổng doanh thu
                        </span>
                        <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                            {Number(metrics.revenue ?? 0).toLocaleString(
                                "vi-VN"
                            )}{" "}
                            đ
                        </h4>
                    </div>

                    {/* <Badge color="error">
                        <ArrowDownIcon />
                        9.05%
                    </Badge> */}
                </div>
            </div>
            {/* <!-- Metric Item End --> */}
        </div>
    );
}
