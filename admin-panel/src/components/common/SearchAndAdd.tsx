import { Button, Input } from "antd";
import React, { useState, useEffect } from "react";

interface SearchAndAddBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
  onAdd?: () => void;
  debounceMs?: number; // thời gian debounce (ms)
  inputWidth?: number | string; // tuỳ chỉnh width input
}

export const SearchAndAddBar: React.FC<SearchAndAddBarProps> = ({
  placeholder = "Search...",
  onSearch,
  onAdd,
  debounceMs = 1000,
  inputWidth = 200,
}) => {
  const [value, setValue] = useState("");

  // debounce effect
  useEffect(() => {
    if (!onSearch) return;
    const handler = setTimeout(() => {
      onSearch(value);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [value, debounceMs, onSearch]);

  return (
    <div className="flex items-center justify-between w-full">
      <Input
        id="searchInput"
        name="searchInput"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        allowClear
        style={{ width: inputWidth }}
      />

      {onAdd && (
        <Button type="primary" onClick={onAdd}>
          Thêm
        </Button>
      )}
    </div>
  );
};
