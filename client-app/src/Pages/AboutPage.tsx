import React from "react";
import {
    Clock,
    Award,
    Truck,
    Shield,
    Star,
    Phone,
    Mail,
    MapPin,
} from "lucide-react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

const AboutPage = () => {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Giới thiệu" },
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <PageBreadcrumb items={breadcrumbItems} />
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-20 px-6">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-6xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        {/* <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full">
                            <Clock className="w-16 h-16 text-amber-400" />
                        </div> */}
                    </div>
                    <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                        Đồng Hồ WeWatch
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Chào mừng bạn đến với cửa hàng đồng hồ uy tín, nơi thời
                        gian không chỉ đơn thuần là con số mà còn là sự thể hiện
                        phong cách và đẳng cấp cá nhân
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Mission Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Sứ Mệnh Của Chúng Tôi
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Sứ mệnh của chúng tôi là mang đến cho bạn trải
                                nghiệm mua sắm trực tuyến tuyệt vời với những
                                chiếc đồng hồ cao cấp. Với kho bộ sưu tập phong
                                phú, từ những thương hiệu nổi tiếng thế giới đến
                                những dòng sản phẩm độc quyền.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Chúng tôi luôn cập nhật xu hướng mới nhất để đáp
                                ứng nhu cầu của mọi khách hàng. Đội ngũ thiết kế
                                của chúng tôi làm việc không ngừng nghỉ để tạo
                                ra những sản phẩm không chỉ đẹp mắt mà còn thoải
                                mái và dễ đeo.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-8 text-white">
                                <div className="grid grid-cols-2 gap-6 text-center">
                                    <div>
                                        <div className="text-3xl font-bold mb-2">
                                            500+
                                        </div>
                                        <div className="text-sm opacity-90">
                                            Khách hàng hài lòng
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold mb-2">
                                            20+
                                        </div>
                                        <div className="text-sm opacity-90">
                                            Thương hiệu
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold mb-2">
                                            2
                                        </div>
                                        <div className="text-sm opacity-90">
                                            Năm kinh nghiệm
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold mb-2">
                                            24/7
                                        </div>
                                        <div className="text-sm opacity-90">
                                            Hỗ trợ khách hàng
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Tại Sao Chọn Chúng Tôi?
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            {
                                icon: Award,
                                title: "Chất Lượng Đảm Bảo",
                                description:
                                    "Tất cả sản phẩm đều được tuyển chọn kỹ lưỡng từ các nhà sản xuất uy tín",
                            },
                            {
                                icon: Star,
                                title: "Đa Dạng Phong Cách",
                                description:
                                    "Từ đồng hồ thể thao năng động đến đồng hồ sang trọng dành cho dịp đặc biệt",
                            },
                            {
                                icon: Truck,
                                title: "Vận Chuyển Nhanh",
                                description:
                                    "Giao hàng toàn quốc trong 24-48 giờ với đội ngũ vận chuyển chuyên nghiệp",
                            },
                            {
                                icon: Shield,
                                title: "Bảo Hành Toàn Diện",
                                description:
                                    "Bảo hành chính hãng và hỗ trợ khách hàng 24/7",
                            },
                        ].map((item, index) => (
                            <div key={index} className="group">
                                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col items-center text-center">
                                    <div className="mb-5">
                                        <div className="p-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                                            <item.icon className="w-8 h-8 text-white" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg lg:text-xl font-bold text-slate-800 mb-2">
                                        {item.title}
                                    </h3>
                                    <p className="text-slate-600 text-sm lg:text-base leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Commitments Section */}
                <div className="mb-20">
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 text-white">
                        <div className="text-center mb-10">
                            <h2 className="text-4xl font-bold mb-4">
                                Cam Kết Chất Lượng
                            </h2>
                            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                                Chúng tôi hiểu rằng việc mua đồng hồ trực tuyến
                                đòi hỏi sự tin tưởng. Vì vậy, chúng tôi cam kết:
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                "Chính Sách Đổi Trả Linh Hoạt",
                                "Bảo Hành Toàn Diện",
                                "Vận Chuyển Nhanh Chóng",
                                "Thanh Toán An Toàn",
                            ].map((commitment, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl font-bold text-slate-900">
                                            {index + 1}
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-lg">
                                        {commitment}
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Journey Section */}
                <div className="mb-20">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold text-slate-800">
                                Hành Trình Phát Triển
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500"></div>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Được thành lập với niềm đam mê dành cho nghệ
                                thuật chế tác đồng hồ, chúng tôi đã không ngừng
                                phát triển và hoàn thiện để trở thành một trong
                                những địa chỉ tin cậy hàng đầu trong lĩnh vực
                                bán lẻ đồng hồ.
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Từ một cửa hàng nhỏ, chúng tôi đã mở rộng thành
                                một hệ thống bán lẻ trực tuyến với hàng ngàn
                                khách hàng tin tưởng.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl p-8 shadow-lg">
                                <div className="space-y-6">
                                    {[
                                        {
                                            year: "2021",
                                            event: "Thành lập cửa hàng đầu tiên",
                                        },
                                        {
                                            year: "2022",
                                            event: "Mở rộng ra thị trường online",
                                        },
                                        {
                                            year: "2023",
                                            event: "Đạt 1000+ khách hàng",
                                        },
                                        {
                                            year: "2024",
                                            event: "Hợp tác với 50+ thương hiệu",
                                        },
                                    ].map((milestone, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-4"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                                                {milestone.year.slice(-2)}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800">
                                                    {milestone.year}
                                                </div>
                                                <div className="text-slate-600">
                                                    {milestone.event}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl p-8 md:p-12">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">
                            Liên Hệ Với Chúng Tôi
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Cảm ơn bạn đã tin tưởng và lựa chọn chúng tôi. Chúng
                            tôi cam kết sẽ luôn đồng hành cùng bạn trong hành
                            trình tìm kiếm chiếc đồng hồ hoàn hảo!
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-semibold text-lg text-slate-800 mb-2">
                                Hotline
                            </h4>
                            <p className="text-slate-600">0350395372</p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-semibold text-lg text-slate-800 mb-2">
                                Email
                            </h4>
                            <p className="text-slate-600">
                                wewatch.contact@gmail.com
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <MapPin className="w-8 h-8 text-white" />
                            </div>
                            <h4 className="font-semibold text-lg text-slate-800 mb-2">
                                Địa chỉ
                            </h4>
                            <p className="text-slate-600">
                                123 Đường Trường Chinh, Phường Vị Hoàng, Thành
                                phố Nam Định
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
