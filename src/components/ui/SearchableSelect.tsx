"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search, X } from "lucide-react";

interface Option {
    value: string;
    label: string;
    labelTh?: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    disabled?: boolean;
    language?: "en" | "th";
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    label,
    disabled = false,
    language = "th",
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Get display label for selected value
    const selectedOption = options.find((opt) => opt.value === value);
    const displayLabel = selectedOption
        ? language === "th" && selectedOption.labelTh
            ? selectedOption.labelTh
            : selectedOption.label
        : "";

    // Filter options based on search
    const filteredOptions = options.filter((opt) => {
        const query = searchQuery.toLowerCase();
        const matchLabel = opt.label.toLowerCase().includes(query);
        const matchLabelTh = opt.labelTh?.toLowerCase().includes(query);
        return matchLabel || matchLabelTh;
    });

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchQuery("");
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange("");
        setSearchQuery("");
    };

    return (
        <div ref={containerRef} className="relative">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            {/* Select Button */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between gap-2 transition-colors ${
                    disabled
                        ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-white border-gray-300 text-gray-900 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                }`}
            >
                <span className={displayLabel ? "text-gray-900" : "text-gray-400"}>
                    {displayLabel || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="p-0.5 hover:bg-gray-100 rounded"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                    <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    />
                </div>
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={language === "th" ? "พิมพ์เพื่อค้นหา..." : "Type to search..."}
                                className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-yellow text-gray-900"
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-48 overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => handleSelect(opt.value)}
                                    className={`w-full px-3 py-2 text-left text-sm hover:bg-brand-yellow/10 transition-colors ${
                                        opt.value === value
                                            ? "bg-brand-yellow/20 text-gray-900 font-medium"
                                            : "text-gray-700"
                                    }`}
                                >
                                    {language === "th" && opt.labelTh ? opt.labelTh : opt.label}
                                    {opt.labelTh && language === "th" && opt.label !== opt.labelTh && (
                                        <span className="text-gray-400 text-xs ml-2">({opt.label})</span>
                                    )}
                                </button>
                            ))
                        ) : (
                            <div className="px-3 py-4 text-center text-sm text-gray-500">
                                {language === "th" ? "ไม่พบข้อมูล" : "No results found"}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
