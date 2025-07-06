import { useParams } from "react-router";
import { useEffect, useState, useCallback } from "react";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import ProductList from "../components/common/ProductList";
import axios from "../libs/axiosConfig";
import { toast } from "react-toastify";
import ReactPaginate from "react-paginate";
import ProductIntroBanner from "../components/common/ProductIntroBanner";
import ProductFilters from "../components/common/ProductFilters";

export default function Category() {
    interface Product {
        id: number;
        modal_num: string;
        name: string;
        brand: {
            id: number;
            name: string;
            description: string;
        };
        origin: string;
        crystal_material: string;
        movement_type: string;
        dial_diameter: string;
        case_thickness: string;
        strap_material: string;
        water_resistance: string;
        category: {
            id: number;
            name: string;
            description: string;
        };
        quantity: number;
        price: number;
        image: string;
        state: string;
        slug: string;
        functions: {
            id: number;
            name: string;
        }[];
    }

    interface FilterOption {
        label: string;
        key: string;
        options: string[];
    }

    const { slug } = useParams();
    const [breadcrumbItems, setBreadcrumbItems] = useState([
        { label: "Trang chủ", path: "/" },
        { label: "Danh mục" },
    ]);
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);
    const [limitData, setLimitData] = useState(12);
    const [filters, setFilters] = useState<{ [key: string]: string }>({});
    const [loading, setLoading] = useState(false);
    const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
    const sortOptions = ["Giá thấp → cao", "Giá cao → thấp"];

    const buildQueryString = useCallback(
        (page: number, limit: number, filters: { [key: string]: string }) => {
            const params = new URLSearchParams();
            params.append("page", page.toString());
            params.append("limit", limit.toString());

            Object.entries(filters).forEach(([key, value]) => {
                if (value && value.trim() !== "") {
                    if (key === "sort") {
                        const sortMapping: { [key: string]: string } = {
                            "Giá thấp → cao": "price_asc",
                            "Giá cao → thấp": "price_desc",
                        };
                        const sortValue = sortMapping[value] || value;
                        params.append("sort", sortValue);
                    } else if (key === "price_range") {
                        const priceMapping: {
                            [key: string]: { min?: string; max?: string };
                        } = {
                            "Dưới 2 triệu": { max: "2000000" },
                            "2-5 triệu": { min: "2000000", max: "5000000" },
                            "5-10 triệu": { min: "5000000", max: "10000000" },
                            "10-20 triệu": { min: "10000000", max: "20000000" },
                            "Trên 20 triệu": { min: "20000000" },
                        };
                        const priceRange = priceMapping[value];
                        if (priceRange) {
                            if (priceRange.min)
                                params.append("min_price", priceRange.min);
                            if (priceRange.max)
                                params.append("max_price", priceRange.max);
                        }
                    } else {
                        params.append(key, value);
                    }
                }
            });

            return params.toString();
        },
        []
    );

    const fetchFilterOptions = async () => {
        try {
            const res = await axios.get("/products/filters");
            const data = res.data;

            const builtOptions = [
                {
                    label: "Thương hiệu",
                    key: "brand_name",
                    options: data.brand_name || [],
                },
                {
                    label: "Giá",
                    key: "price_range",
                    options: [
                        "Dưới 2 triệu",
                        "2-5 triệu",
                        "5-10 triệu",
                        "10-20 triệu",
                        "Trên 20 triệu",
                    ],
                },
                {
                    label: "Loại máy",
                    key: "movement_type",
                    options: data.movement_type || [],
                },
                {
                    label: "Chất liệu dây",
                    key: "strap_material",
                    options: data.strap_material || [],
                },
                {
                    label: "Chất liệu mặt kính",
                    key: "crystal_material",
                    options: data.crystal_material || [],
                },
            ];

            setFilterOptions(builtOptions);
        } catch (err) {
            console.error("Lỗi khi lấy bộ lọc:", err);
        }
    };

    const handlePageClick = (selectedItem: { selected: number }) => {
        const newPage = selectedItem.selected + 1;
        setPage(newPage);
        fetchProducts(newPage, limitData, filters);
    };

    const handleFilterChange = (newFilters: { [key: string]: string }) => {
        console.log("Filters changed:", newFilters);
        setFilters(newFilters);
        setPage(1); // Reset về trang 1 khi filter thay đổi
        fetchProducts(1, limitData, newFilters);
    };

    const handleSortChange = (sortValue: string) => {
        console.log("Sort changed:", sortValue);
        const newFilters = { ...filters, sort: sortValue };
        setFilters(newFilters);
        setPage(1); // Reset về trang 1 khi sort thay đổi
        fetchProducts(1, limitData, newFilters);
    };
    // const fetchProducts = async (page: number, limit: number) => {
    //     try {
    //         let res = await axios.get(
    //             `/danh-muc/${slug}?page=${page}&limit=${limit}`
    //         );
    //         console.log(res);
    //         setProducts(res.data.data);
    //         setLimitData(res.data.limit);
    //         setTotalPage(res.data.pagination.totalPages);
    //     } catch (err) {
    //         console.error("Lỗi khi tải danh sách:", err);
    //         toast.error("Lỗi khi tải danh sách");
    //     }
    // };

    const fetchProducts = useCallback(
        async (
            page: number,
            limit: number,
            currentFilters: { [key: string]: string } = {}
        ) => {
            console.log("fetchProducts called with:", {
                slug,
                page,
                limit,
                currentFilters,
            });

            if (!slug) {
                console.log("No slug provided, aborting fetch");
                return;
            }

            setLoading(true);
            try {
                const queryString = buildQueryString(
                    page,
                    limit,
                    currentFilters
                );
                const url = `/danh-muc/${slug}?${queryString}`;
                console.log(`Fetching URL: ${url}`);

                const res = await axios.get(url);
                console.log("API Response:", res.data);

                if (res.data && res.data.data) {
                    setProducts(res.data.data);
                    setLimitData(res.data.limit || limit);
                    setPage(res.data.page || page);
                    setTotalPage(res.data.pagination?.totalPages || 0);
                    console.log(
                        "Products set successfully:",
                        res.data.data.length,
                        "items"
                    );
                } else {
                    console.log("No data in response");
                    setProducts([]);
                }
            } catch (err) {
                console.error("Fetch error details:", err);
                if (err.response) {
                    console.error("Response status:", err.response.status);
                    console.error("Response data:", err.response.data);
                }
                toast.error("Lỗi khi tải danh sách sản phẩm");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        },
        [slug, buildQueryString]
    );
    // useEffect chính - reset và load dữ liệu khi slug thay đổi
    useEffect(() => {
        console.log(
            "useEffect triggered - Slug:",
            slug,
            "limitData:",
            limitData
        );

        if (slug) {
            // Reset tất cả state khi chuyển sang brand mới
            fetchFilterOptions();
            setProducts([]);
            setPage(1);
            setTotalPage(0);
            setFilters({});
            setLoading(true);

            // Load dữ liệu mới
            fetchProducts(1, limitData, {});
        } else {
            console.log("No slug found");
        }
    }, [slug, limitData]); // Bỏ fetchProducts khỏi dependency để tránh infinite loop
    return (
        <>
            <PageBreadcrumb items={breadcrumbItems} />
            <div className="intro">
                <ProductIntroBanner
                    title={`Thương hiệu ${products[0]?.category?.name ?? ""}`}
                    subtitle={`${products[0]?.category?.name ?? ""} chính hãng`}
                    imageUrl={"/images/default-brand-banner.jpg"}
                    description={products[0]?.category?.description ?? ""}
                />
            </div>
            <div className="filter">
                <ProductFilters
                    filters={filterOptions}
                    sortOptions={sortOptions}
                    onFilterChange={handleFilterChange}
                    onSortChange={handleSortChange}
                />
            </div>

            <div className="products">
                {" "}
                {loading ? (
                    <div className="loading-spinner text-center py-8">
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : products.length > 0 ? (
                    <ProductList products={products} />
                ) : (
                    <div className="no-products text-center py-8">
                        <p>Không có sản phẩm nào được tìm thấy.</p>
                    </div>
                )}
            </div>
            <div className="pagigate flex justify-center">
                <ReactPaginate
                    nextLabel="Tiếp >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={totalPage}
                    previousLabel="< Trước"
                    pageClassName="page-item cursor-pointer hover:text-blue-900"
                    pageLinkClassName="page-link p-2 cursor-pointer"
                    previousClassName="page-item"
                    previousLinkClassName="page-link cursor-pointer hover:text-blue-900"
                    nextClassName="page-item"
                    nextLinkClassName="page-link cursor-pointer hover:text-blue-900"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination flex font-semibol text-gray-500 text-theme-md dark:text-gray-400"
                    activeClassName="active text-blue-600"
                    renderOnZeroPageCount={null}
                    forcePage={page - 1} // Đảm bảo pagination hiển thị đúng trang
                />
            </div>
        </>
    );
}
