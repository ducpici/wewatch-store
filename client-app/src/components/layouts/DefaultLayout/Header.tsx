// Header.tsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import useSession from "@/hooks/useSession";
import useIsMobile from "@/hooks/useIsMobile";
import {
  User,
  Package,
  LogOut,
  LogIn,
  ShoppingCart,
  Menu,
  X,
  Search,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { user, clearSession } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [value, setValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scroll, setScroll] = useState(false);
  const [activePopover, setActivePopover] = useState<string | null>(null);

  const togglePopover = (name: string) => {
    setActivePopover((prev) => (prev === name ? null : name));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) {
        // Cuộn xuống => ẩn header
        setScroll(true);
      } else {
        // Cuộn lên => hiện header
        setScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (keyword: string) => {
    navigate(`/tim-kiem?keyword=${encodeURIComponent(keyword)}`);
    setMenuOpen(false);
  };
  // Khóa scroll khi mở mobile menu
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);
  return (
    <header
      className={`fixed top-0 left-0 right-0 bg-white shadow z-10 w-full p-2`}
    >
      <div
        className={`md:max-w-6xl m-auto transition-all duration-300 ${
          scroll && !isMobile ? "py-1" : ""
        }`}
      >
        {/* Top header */}
        <div className="grid grid-cols-3 items-center">
          {scroll && !isMobile ? (
            <div id="logo">
              <Link to="/">
                <img
                  className={` ${scroll ? "w-20" : "md:w-30"}`}
                  src="/images/mylogo.png"
                  alt="logo"
                />
              </Link>
            </div>
          ) : (
            <div className="flex items-center">
              <span className="font-bold hidden md:block">
                Hotline: 0350395372
              </span>
              {/* Hamburger mobile */}
              <div className="md:hidden cursor-pointer">
                {menuOpen ? (
                  <X onClick={() => setMenuOpen(false)} />
                ) : (
                  <Menu onClick={() => setMenuOpen(true)} />
                )}
              </div>
            </div>
          )}
          {scroll && !isMobile ? (
            <Navbar />
          ) : (
            <div id="logo" className="flex justify-center">
              <Link to="/">
                <img
                  className="w-20 md:w-30"
                  src="/images/mylogo.png"
                  alt="logo"
                />
              </Link>
            </div>
          )}

          {/* User / Cart */}
          <div className="flex items-center justify-end h-full">
            <ul className="flex items-center gap-2">
              {scroll && !isMobile && (
                <li className="flex items-center h-full">
                  <Popover
                    open={activePopover === "search"}
                    onOpenChange={(open) =>
                      setActivePopover(open ? "search" : null)
                    }
                  >
                    <PopoverTrigger className="h-full cursor-pointer hover:text-black">
                      <Search />
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="flex justify-center py-1">
                        <div className="w-full md:w-200 py-2 px-4 flex bg-gray-200">
                          <input
                            className="outline-none w-full placeholder:text-gray-500 placeholder:italic"
                            type="text"
                            placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && value.trim())
                                handleSearch(value.trim());
                            }}
                          />
                          <Search />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </li>
              )}
              <li className="flex items-center h-full">
                <Popover
                  open={activePopover === "user"}
                  onOpenChange={(open) =>
                    setActivePopover(open ? "user" : null)
                  }
                >
                  <PopoverTrigger className="h-full cursor-pointer hover:text-black">
                    <User />
                  </PopoverTrigger>
                  <PopoverContent className="w-fit border border-gray-300 rounded shadow-lg">
                    <ul>
                      {user ? (
                        <>
                          <li>
                            <Link
                              to="/thong-tin-ca-nhan"
                              className="px-4 py-2 hover:bg-gray-100 flex items-center"
                              onClick={() => setActivePopover(null)}
                            >
                              <User className="mr-1 text-gray-500" /> Thông tin
                              cá nhân
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/don-hang"
                              className="px-4 py-2 hover:bg-gray-100 flex items-center"
                              onClick={() => setActivePopover(null)}
                            >
                              <Package className="mr-1 text-gray-500" /> Đơn
                              hàng của tôi
                            </Link>
                          </li>
                          <li className="border-t border-gray-300">
                            <Link
                              to="/"
                              className="px-4 py-2 hover:bg-gray-100 flex items-center text-red-500"
                              onClick={() => {
                                clearSession();
                                setActivePopover(null);
                                toast.success("Đăng xuất thành công");
                              }}
                            >
                              <LogOut className="mr-1 text-red-500" /> Đăng xuất
                            </Link>
                          </li>
                        </>
                      ) : (
                        <li className="">
                          <Link
                            to="/signin"
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                          >
                            <LogIn className="mr-1 text-blue-500" />
                            Đăng nhập/Đăng ký
                          </Link>
                        </li>
                      )}
                    </ul>
                  </PopoverContent>
                </Popover>
              </li>
              <li>
                <Link
                  to="/gio-hang"
                  className="flex items-center font-semibold hover:text-black"
                >
                  <ShoppingCart />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* --- SEARCH (desktop only) --- */}
        {!scroll && !isMobile && (
          <div className="flex justify-center py-1">
            <div className="w-full md:w-200 py-2 px-4 flex bg-gray-200">
              <input
                className="outline-none w-full placeholder:text-gray-500 placeholder:italic"
                type="text"
                placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && value.trim())
                    handleSearch(value.trim());
                }}
              />
              <Search />
            </div>
          </div>
        )}

        {/* Navbar Desktop */}
        <div
          className={`hidden md:flex ${
            scroll ? `justify-between` : `justify-center`
          }`}
        >
          {!scroll && <Navbar />}
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 bg-black/30 z-40 md:hidden"
              onClick={() => setMenuOpen(false)}
            ></div>
            {/* Menu */}
            <div
              className="fixed left-0 right-0 bottom-0 bg-white z-50 md:hidden overflow-y-auto"
              style={{ top: "60px" }}
            >
              <div className="flex justify-center px-4 py-3">
                <div className="w-full md:w-200 py-2 px-4 flex bg-gray-200">
                  <input
                    className="outline-none w-full placeholder:text-gray-500 placeholder:italic"
                    type="text"
                    placeholder="Tìm kiếm sản phẩm hoặc thương hiệu..."
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && value.trim())
                        handleSearch(value.trim());
                    }}
                  />
                  <Search />
                </div>
              </div>
              <Navbar isOpen={true} onItemClick={() => setMenuOpen(false)} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}
