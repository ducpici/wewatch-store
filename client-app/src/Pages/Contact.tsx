import React, { useState } from "react";
import { Phone, Mail, Clock } from "lucide-react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";

export default function Contact() {
    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Liên hệ" },
    ];
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
        // Reset form
        setFormData({
            name: "",
            email: "",
            message: "",
        });
    };

    return (
        <div className="max-w-6xl mx-auto">
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="flex items-center justify-center pb-2">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-6xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">
                        {/* Left Side - Contact Info */}
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 lg:w-1/2">
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                Gửi tin nhắn
                            </h2>
                            <p className="text-gray-600 mb-8">
                                Bạn cũng có thể liên hệ với chúng tôi thông qua
                                địa chỉ bên dưới!
                            </p>

                            <div className="space-y-6">
                                {/* Phone */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                                        <Phone className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold">
                                            0350395372
                                        </p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                                        <Mail className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold">
                                            wewatch.contact@gmail.com
                                        </p>
                                    </div>
                                </div>

                                {/* Hours */}
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                                        <Clock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-semibold">
                                            Thứ 2 - Thứ 6
                                        </p>
                                        <p className="text-gray-600">
                                            8h00 - 17h00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Contact Form */}
                        <div className="p-8 lg:w-1/2">
                            <div className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ và tên
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Nhập họ và tên của bạn"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Nhập email của bạn"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nội dung
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200 resize-none"
                                        placeholder="Viết cho chúng tôi ngay!"
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        className="bg-teal-500 hover:bg-teal-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                                    >
                                        Gửi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>{" "}
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d287.53337398869184!2d106.17056388856828!3d20.430390206570618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135e74fd1cefedb%3A0xba3a472efa3f49d2!2zMTIzIFRyxrDhu51uZyBDaGluaCwgQ-G7rWEgQuG6r2MsIE5hbSDEkOG7i25oLCBWaeG7h3QgTmFt!5e1!3m2!1svi!2s!4v1751899597639!5m2!1svi!2s"
                className="md:w-6xl w-full md:h-[500px] h-[200px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
            />
        </div>
    );
}
