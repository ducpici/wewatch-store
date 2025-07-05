import { useState } from "react";

// Interface cho từng option (hỗ trợ label + id)
interface FilterOption {
    id: string | number;
    label: string;
}

// Interface cho từng filter
interface FilterItem {
    label: string;
    key: string;
    options: FilterOption[];
}

// Props cho component Filters
interface ProductFiltersProps {
    filters?: FilterItem[];
    sortOptions?: string[];
    onFilterChange?: (selectedFilters: {
        [key: string]: string | number;
    }) => void;
    onSortChange?: (sortValue: string) => void;
    onAdvancedFilterClick?: () => void;
    className?: string;
    showAdvancedFilter?: boolean;
    showSort?: boolean;
}

// Component
const Filters: React.FC<ProductFiltersProps> = ({
    filters = [],
    sortOptions = [],
    onFilterChange,
    onSortChange,
    onAdvancedFilterClick,
    className = "",
    showAdvancedFilter = true,
    showSort = true,
}) => {
    const [selectedFilters, setSelectedFilters] = useState<{
        [key: string]: string | number;
    }>({});
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    const handleSelect = (key: string, value: string | number) => {
        const updated = { ...selectedFilters, [key]: value };
        setSelectedFilters(updated);
        setOpenDropdown(null);

        if (onFilterChange) onFilterChange(updated);
        if (key === "sort" && onSortChange) onSortChange(String(value));
    };

    const clearFilter = (key: string) => {
        const updated = { ...selectedFilters };
        delete updated[key];
        setSelectedFilters(updated);
        if (onFilterChange) onFilterChange(updated);
    };

    const clearAllFilters = () => {
        setSelectedFilters({});
        if (onFilterChange) onFilterChange({});
    };

    const toggleDropdown = (key: string) => {
        setOpenDropdown((prev) => (prev === key ? null : key));
    };

    const activeFilterCount = Object.keys(selectedFilters).filter(
        (key) => key !== "sort"
    ).length;

    return (
        <div
            className={`flex flex-wrap items-center gap-2 relative z-10 ${className}`}
        >
            {/* Bộ lọc nâng cao */}
            {showAdvancedFilter && (
                <button
                    onClick={
                        onAdvancedFilterClick ||
                        (() => alert("Hiện modal lọc nâng cao"))
                    }
                    className="px-3 py-1 text-sm flex items-center gap-1 hover:bg-gray-50 transition-colors cursor-pointer"
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

            {/* Nút xóa tất cả */}
            {activeFilterCount > 0 && (
                <button
                    onClick={clearAllFilters}
                    className="text-red-500 text-sm hover:text-red-700 transition-colors cursor-pointer"
                >
                    Xóa tất cả
                </button>
            )}

            {/* Các bộ lọc */}
            {filters.map(({ label, key, options }) => {
                const selectedId = selectedFilters[key];
                const selectedLabel = options.find(
                    (o) => o.id === selectedId
                )?.label;

                return (
                    <div key={key} className="relative">
                        <button
                            onClick={() => toggleDropdown(key)}
                            className={`border px-3 py-1 rounded text-sm hover:bg-gray-50 transition-colors flex items-center gap-1 ${
                                typeof selectedId !== "undefined"
                                    ? "bg-blue-50 border-blue-300"
                                    : ""
                            }`}
                        >
                            {label}
                            {typeof selectedLabel !== "undefined" &&
                                `: ${selectedLabel}`}
                            {typeof selectedId !== "undefined" && (
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
                                {options.map(({ id, label }) => (
                                    <div
                                        key={id}
                                        onClick={() => handleSelect(key, id)}
                                        className={`px-4 py-2 hover:bg-gray-100 cursor-pointer whitespace-nowrap ${
                                            selectedId === id
                                                ? "bg-blue-50 text-blue-600"
                                                : ""
                                        }`}
                                    >
                                        {label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default Filters;
