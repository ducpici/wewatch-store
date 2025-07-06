import React from "react";
import "/public/styles/footer.css";
class Footer extends React.Component {
    render() {
        return (
            <footer className="footer grid auto-rows-auto md:grid-cols-4">
                <div className="footer-block">
                    <div className="flex justify-center">
                        <a href="">
                            <img
                                className="w-20"
                                src="/public/images/mylogo.png"
                                alt=""
                            />
                        </a>
                    </div>
                    <ul className="list-contact">
                        <li>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 400Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Z" />
                            </svg>
                            <span>
                                Số 123 Đường Trường Chinh, Phường Vị Hoàng,
                                Thành phố Nam Định
                            </span>
                        </li>
                        <li>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M798-120q-125 0-247-54.5T329-329Q229-429 174.5-551T120-798q0-18 12-30t30-12h162q14 0 25 9.5t13 22.5l26 140q2 16-1 27t-11 19l-97 98q20 37 47.5 71.5T387-386q31 31 65 57.5t72 48.5l94-94q9-9 23.5-13.5T670-390l138 28q14 4 23 14.5t9 23.5v162q0 18-12 30t-30 12Z" />
                            </svg>
                            <span>0350395372</span>
                        </li>
                        <li>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#000000"
                            >
                                <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
                            </svg>
                            <span>wewatch.contact@gmail.com</span>
                        </li>
                    </ul>
                </div>
                <div className="footer-block">
                    <h3 className="title-footer">Thương hiệu</h3>
                    <ul className="nav-menu">
                        <li>
                            <a href="">Casio</a>
                        </li>
                        <li>
                            <a href="">Seiko</a>
                        </li>
                        <li>
                            <a href="">Citizen</a>
                        </li>
                        <li>
                            <a href="">Orient</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-block">
                    <h3 className="title-footer">Danh mục sản phẩm</h3>
                    <ul className="nav-menu">
                        <li>
                            <a href="">Đồng hồ Nam</a>
                        </li>
                        <li>
                            <a href="">Đồng hồ Nữ</a>
                        </li>
                        <li>
                            <a href="">Đồng hồ Cặp đôi</a>
                        </li>
                    </ul>
                </div>
                <div className="footer-block">
                    <h3 className="title-footer">Đăng ký nhận tin</h3>
                    <p>
                        Nhận thông tin sản phẩm mới nhất, tin khuyến mãi và
                        nhiều hơn nữa.
                    </p>
                    <div>
                        <input type="text" placeholder="Email của bạn" />
                        <button>Đăng ký</button>
                        <div className="footer-cards">
                            <img src="/public/images/visa.jpg" alt="" />
                        </div>
                    </div>
                </div>
            </footer>
        );
    }
}
export default Footer;
