import { useState } from "react";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { validators } from "tailwind-merge";

interface SearchAndAddBarProps {
    value: string;
    onChange: (value: string) => void;
    onSearch: (value: string) => void;
    onAdd: () => void;
    placeholder?: string;
    addLabel?: string;
}

export const SearchAndAddBar: React.FC<SearchAndAddBarProps> = ({
    value,
    onChange,
    onSearch,
    onAdd,
    placeholder = "Tìm kiếm...",
    addLabel = "Thêm mới",
}) => {
    return (
        <div className="flex items-center justify-between">
            {/* <input
                type="text"
                className="input"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch(value);
                }}
            />
            <button className="btn btn-primary ml-4" onClick={onAdd}>
                {addLabel}
            </button> */}
            <Input
                id="search"
                name="search"
                value={value}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") onSearch(value);
                }}
            />
            <Button
                size="sm"
                variant="primary"
                onClick={() => {
                    onAdd();
                }}
            >
                Thêm mới
            </Button>
        </div>
    );
};
