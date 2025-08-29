import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
    return (
        <>
            <PageMeta
                title="WeWatch Admin"
                description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
            />
            <div className="grid grid-cols-12 gap-4 md:gap-6">
                <div className="col-span-12 space-y-6 xl:col-span-12">
                    <EcommerceMetrics />

                    <MonthlySalesChart />
                </div>

                <div className="col-span-12">
                    <StatisticsChart />
                </div>
            </div>
        </>
    );
}
