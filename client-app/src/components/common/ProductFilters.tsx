import { useState } from "react";

// Interface cho filter item với key riêng
interface FilterItem {
    label: string;
    key: string; // Key để sử dụng trong query
    options: string[];
}

// Default filters với key
const defaultFilters: FilterItem[] = [
    {
        label: "Thương hiệu",
        key: "brand",
        options: ["Casio", "Citizen", "Seiko"],
    },
    {
        label: "Lọc theo giá",
        key: "price_range",
        options: ["Dưới 2 triệu", "2-5 triệu", "5-10 triệu"],
    },
    {
        label: "Thể loại",
        key: "category",
        options: ["Đồng hồ Nam", "Đồng hồ Nữ", "Đồng hồ Cặp đôi"],
    },
    {
        label: "Chất liệu dây",
        key: "strap_material",
        options: ["Da", "Thép", "Nhựa"],
    },
    {
        label: "Chất liệu mặt kính",
        key: "glass_material",
        options: [
            "Mineral Crystal (Kính cứng)",
            "Sapphire (Kính chống trầy)",
            "Resin Glass (Kính nhựa)",
        ],
    },
    {
        label: "Loại máy",
        key: "movement_type",
        options: [
            "Quartz (Pin)",
            "Eco-Drive (Năng lượng ánh sáng)",
            "Automatic",
        ],
    },
];

// Default sort options
const defaultSortOptions = ["Đánh giá cao → thấp", "Giá thấp → cao"];

// Interface cho props
interface ProductFiltersProps {
    filters?: FilterItem[];
    sortOptions?: string[];
    onFilterChange?: (selectedFilters: { [key: string]: string }) => void;
    onSortChange?: (sortValue: string) => void;
    onAdvancedFilterClick?: () => void;
    className?: string;
    showAdvancedFilter?: boolean;
    showSort?: boolean;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
    filters = defaultFilters,
    sortOptions = defaultSortOptions,
    onFilterChange,
    onSortChange,
    onAdvancedFilterClick,
    className = "",
    showAdvancedFilter = true,
    showSort = true,
}) => {
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string;
    }>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSelect = (key: string, value: string) => {
        const newFilters = { ...selectedFilters, [key]: value };
        setSelectedFilters(newFilters);
        setOpenDropdown(null);

        // Callback để parent component biết được filter đã thay đổi
        if (onFilterChange) {
            onFilterChange(newFilters);
        }

        // Callback riêng cho sort
        if (key === "sort" && onSortChange) {
            onSortChange(value);
        }
    };

    const clearFilter = (key: string) => {
        const newFilters = { ...selectedFilters };
        delete newFilters[key];
        setSelectedFilters(newFilters);

        if (onFilterChange) {
            onFilterChange(newFilters);
        }
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
        if (onFilterChange) {
            onFilterChange({});
        }
    };

    const toggleDropdown = (key: string) => {
        setOpenDropdown((prev) => (prev === key ? null : key));
    };

    // Đếm số filter đã chọn (không tính sort)
    const activeFilterCount = Object.keys(selectedFilters).filter(
        (key) => key !== "sort"
    ).length;

    return (
        <div
            className={`flex flex-wrap items-center gap-2 relative z-10 ${className}`}
        >
            {/* Bộ lọc tổng */}
            {showAdvancedFilter && (
                <button
                    onClick={
                        onAdvancedFilterClick ||
                        (() => alert("Hiện modal lọc nâng cao"))
                    }
                    className=" px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
                        />
                    </svg>
                    Bộ lọc {activeFilterCount > 0 && `(${activeFilterCount})`}
                </button>
            )}

            {/* Clear all filters button */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="text-red-500 text-sm hover:text-red-700 transition-colors cursor-pointer"
                >
                    Xóa tất cả
                </button>
            )}

            {/* Các dropdown bộ lọc - Sử dụng key thay vì label */}
            {filters.map(({ label, key, options }) => (
                <div key={key} className="relative">
                    <button
                        onClick={() => toggleDropdown(key)}
                        className={`border px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1 ${
                            selectedFilters[key]
                                ? "bg-blue-50 border-blue-300"
                                : ""
                        }`}
                    >
                        {label}{" "}
                        {selectedFilters[key] && `: ${selectedFilters[key]}`}
                        {/* Clear individual filter */}
                        {selectedFilters[key] && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    clearFilter(key);
                                }}
                                className="ml-1 text-gray-500 hover:text-red-500"
                            >
                                ×
                            </button>
                        )}
                    </button>

                    {openDropdown === key && (
                        <div className="absolute top-full left-0 bg-white shadow-lg border mt-1 z-20 rounded text-sm min-w-max">
                            {options.map((option) => (
                                <div
                                    key={option}
                                    onClick={() => handleSelect(key, option)}
                                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap ${
                                        selectedFilters[key] === option
                                            ? "bg-blue-50 text-blue-600"
                                            : ""
                                    }`}
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* Sắp xếp theo */}
            {showSort && (
                <div className="relative ml-auto">
                    <button
                        onClick={() => toggleDropdown("sort")}
                        className={`border px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedFilters["sort"]
                                ? "bg-blue-50 border-blue-300"
                                : ""
                        }`}
                    >
                        Sắp xếp
                        {selectedFilters["sort"] &&
                            `: ${selectedFilters["sort"]}`}
                    </button>
                    {openDropdown === "sort" && (
                        <div className="absolute top-full right-0 bg-white shadow-lg border mt-1 z-20 rounded text-sm min-w-max">
                            {sortOptions.map((sort) => (
                                <div
                                    key={sort}
                                    onClick={() => handleSelect("sort", sort)}
                                    className={`px-4 py-2 hover:bg-gray-200 cursor-pointer whitespace-nowrap ${
                                        selectedFilters["sort"] === sort
                                            ? "bg-blue-50 text-blue-600"
                                            : ""
                                    }`}
                                >
                                    {sort}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductFilters;
