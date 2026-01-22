"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Types
export interface FilterOption {
    value: string;
    label: string;
    labelTh?: string;
    count?: number;
}

export interface RangeConfig {
    min: number;
    max: number;
    step: number;
    unit?: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    labelTh: string;
    options?: FilterOption[];
    type?: 'checkbox' | 'color' | 'range';
    range?: RangeConfig;
}

export interface ActiveFilters {
    [key: string]: string[];
}

export interface SortOption {
    value: string;
    label: string;
    labelTh: string;
}

// Filter Dropdown Component
function FilterDropdown({
    config,
    selectedValues,
    onToggle,
    onSetValue,
    isOpen,
    onOpenChange,
    language
}: {
    config: FilterConfig;
    selectedValues: string[];
    onToggle: (value: string) => void;
    onSetValue?: (value: string) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    language: string;
}) {
    const label = language === 'th' ? config.labelTh : config.label;
    const options = config.options ?? [];
    const rangeConfig = config.range ?? { min: 0, max: 100, step: 5, unit: '%' };
    const currentRangeValue = Number(selectedValues[0] ?? rangeConfig.min);
    const isRange = config.type === 'range';
    const isRangeActive = isRange && currentRangeValue > rangeConfig.min;
    const isActive = isRange ? isRangeActive : selectedValues.length > 0;
    const badgeLabel = isRange
        ? `${currentRangeValue}${rangeConfig.unit ?? ''}`
        : selectedValues.length.toString();
    const closeDropdown = () => onOpenChange(false);

    const clampRange = (value: number) => Math.min(rangeConfig.max, Math.max(rangeConfig.min, value));
    const handleRangeChange = (value: number) => {
        const clamped = clampRange(value);
        const nextValue = clamped === rangeConfig.min ? '' : String(clamped);
        if (onSetValue) {
            onSetValue(nextValue);
            return;
        }
        if (nextValue) {
            onToggle(nextValue);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => onOpenChange(!isOpen)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-full transition-all ${isRange
                    ? 'border-gray-300 text-gray-700 hover:border-gray-400'
                    : isActive
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
            >
                {label}
                {isActive && (
                    isRange ? (
                        <span className="px-2 py-0.5 min-w-[40px] bg-gray-200 text-black rounded-full text-xs flex items-center justify-center font-bold">
                            {badgeLabel}
                        </span>
                    ) : (
                        <span className="w-5 h-5 bg-brand-yellow text-black rounded-full text-xs flex items-center justify-center font-bold">
                            {badgeLabel}
                        </span>
                    )
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                        <div className="max-h-64 overflow-y-auto p-2">
                            {config.type === 'range' ? (
                                <div className="p-4">
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                                        <span>{rangeConfig.min}{rangeConfig.unit ?? ''}</span>
                                        <span className="text-sm font-semibold text-black">
                                            {currentRangeValue}{rangeConfig.unit ?? ''}
                                        </span>
                                        <span>{rangeConfig.max}{rangeConfig.unit ?? ''}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={rangeConfig.min}
                                        max={rangeConfig.max}
                                        step={rangeConfig.step}
                                        value={currentRangeValue}
                                        onChange={(event) => handleRangeChange(Number(event.target.value))}
                                        onWheel={(event) => {
                                            event.preventDefault();
                                            const direction = event.deltaY < 0 ? 1 : -1;
                                            handleRangeChange(currentRangeValue + direction * rangeConfig.step);
                                            closeDropdown();
                                        }}
                                        onMouseUp={closeDropdown}
                                        onTouchEnd={closeDropdown}
                                        onKeyUp={(event) => {
                                            if (event.key === 'Enter' || event.key === ' ') {
                                                closeDropdown();
                                            }
                                        }}
                                        onBlur={closeDropdown}
                                        className="w-full accent-black"
                                    />
                                    <p className="mt-2 text-xs text-gray-400">
                                        {language === 'th' ? 'เลื่อนเมาส์เพื่อปรับ' : 'Scroll to adjust'}
                                    </p>
                                </div>
                            ) : config.type === 'color' ? (
                                <div className="grid grid-cols-5 gap-2 p-2">
                                    {options.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => onToggle(option.value)}
                                            className={`w-8 h-8 rounded-full border-2 transition-all ${selectedValues.includes(option.value)
                                                ? 'border-black scale-110'
                                                : 'border-gray-200 hover:border-gray-400'
                                                }`}
                                            style={{ backgroundColor: option.value }}
                                            title={language === 'th' && option.labelTh ? option.labelTh : option.label}
                                        />
                                    ))}
                                </div>
                            ) : (
                                options.map((option) => (
                                    <label
                                        key={option.value}
                                        className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedValues.includes(option.value)}
                                                onChange={() => onToggle(option.value)}
                                                className="w-4 h-4 accent-black rounded"
                                            />
                                            <span className="text-sm text-gray-700">
                                                {language === 'th' && option.labelTh ? option.labelTh : option.label}
                                            </span>
                                        </div>
                                        {option.count !== undefined && (
                                            <span className="text-xs text-gray-400">({option.count})</span>
                                        )}
                                    </label>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sort Dropdown Component
function SortDropdown({
    value,
    options,
    onChange,
    isOpen,
    onOpenChange,
    language
}: {
    value: string;
    options: SortOption[];
    onChange: (value: string) => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    language: string;
}) {
    const selectedOption = options.find(o => o.value === value) || options[0];
    const selectedLabel = language === 'th' ? selectedOption.labelTh : selectedOption.label;

    return (
        <div className="relative">
            <button
                onClick={() => onOpenChange(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
            >
                {selectedLabel}
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden"
                    >
                        <div className="p-2">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        onOpenChange(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${value === option.value
                                        ? 'bg-black text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                >
                                    {language === 'th' ? option.labelTh : option.label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Main ProductFilterBar Component
interface ProductFilterBarProps {
    filters: FilterConfig[];
    activeFilters: ActiveFilters;
    onFilterChange: (filterKey: string, value: string) => void;
    onFilterValueChange?: (filterKey: string, value: string) => void;
    onClearAll: () => void;
    sortOptions: SortOption[];
    sortValue: string;
    onSortChange: (value: string) => void;
    totalItems: number;
    className?: string;
}

export default function ProductFilterBar({
    filters,
    activeFilters,
    onFilterChange,
    onFilterValueChange,
    onClearAll,
    sortOptions,
    sortValue,
    onSortChange,
    totalItems,
    className = ""
}: ProductFilterBarProps) {
    const { language } = useLanguage();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    const activeFiltersCount = Object.values(activeFilters).reduce((sum, arr) => sum + arr.length, 0);

    const getFilterLabel = (filterKey: string, value: string): string => {
        const filter = filters.find(f => f.key === filterKey);
        if (!filter) return value;
        if (filter.type === 'range') {
            const unit = filter.range?.unit ?? '%';
            return value ? `${language === 'th' ? filter.labelTh : filter.label} ${value}${unit}` : (language === 'th' ? filter.labelTh : filter.label);
        }
        const option = filter.options?.find(o => o.value === value);
        if (!option) return value;
        return language === 'th' && option.labelTh ? option.labelTh : option.label;
    };

    return (
        <>
            {/* Filter Bar */}
            <section className={`sticky top-[68px] z-40 bg-white border-b border-gray-200 ${className}`}>
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        {/* Left: Filters */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Filter Button */}
                            <button
                                onClick={() => setIsMobileFilterOpen(true)}
                                className="md:hidden flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-300 rounded-full"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {language === 'th' ? 'ตัวกรอง' : 'Filters'}
                                {activeFiltersCount > 0 && (
                                    <span className="w-5 h-5 bg-brand-yellow text-black rounded-full text-xs flex items-center justify-center font-bold">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </button>

                            {/* Desktop Filters */}
                            <div className="hidden md:flex items-center gap-3 flex-wrap">
                                {filters.map((filter) => (
                                    <FilterDropdown
                                        key={filter.key}
                                        config={filter}
                                        selectedValues={activeFilters[filter.key] || []}
                                        onToggle={(v) => onFilterChange(filter.key, v)}
                                        onSetValue={(value) => (onFilterValueChange ? onFilterValueChange(filter.key, value) : onFilterChange(filter.key, value))}
                                        isOpen={openDropdown === filter.key}
                                        onOpenChange={(open) => setOpenDropdown(open ? filter.key : null)}
                                        language={language}
                                    />
                                ))}

                                {/* Clear Filters */}
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={onClearAll}
                                        className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-black transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        {language === 'th' ? 'ล้างตัวกรอง' : 'Clear all'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Right: Sort & Count */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 whitespace-nowrap">
                                {totalItems} {language === 'th' ? 'รายการ' : 'items'}
                            </span>
                            <div className="hidden sm:block">
                                <SortDropdown
                                    value={sortValue}
                                    options={sortOptions}
                                    onChange={onSortChange}
                                    isOpen={openDropdown === 'sort'}
                                    onOpenChange={(open) => setOpenDropdown(open ? 'sort' : null)}
                                    language={language}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Filter Tags */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {Object.entries(activeFilters).map(([filterKey, values]) =>
                                values.map(value => (
                                    <span
                                        key={`${filterKey}-${value}`}
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full"
                                    >
                                        {getFilterLabel(filterKey, value)}
                                        <button
                                            onClick={() => onFilterChange(filterKey, value)}
                                            className="hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Mobile Filter Panel */}
            <AnimatePresence>
                {isMobileFilterOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 md:hidden"
                            onClick={() => setIsMobileFilterOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed left-0 top-0 bottom-0 w-80 bg-white z-50 md:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold">
                                        {language === 'th' ? 'ตัวกรอง' : 'Filters'}
                                    </h2>
                                    <button onClick={() => setIsMobileFilterOpen(false)}>
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* All Filters */}
                                {filters.map((filter) => (
                                    <div key={filter.key} className="mb-6">
                                        <h3 className="font-semibold mb-3">
                                            {language === 'th' ? filter.labelTh : filter.label}
                                        </h3>
                                        {filter.type === 'range' ? (() => {
                                            const range = filter.range ?? { min: 0, max: 100, step: 5, unit: '%' };
                                            const currentValue = Number((activeFilters[filter.key] || [])[0] ?? range.min);
                                            const handleRangeChange = (value: number) => {
                                                const clamped = Math.min(range.max, Math.max(range.min, value));
                                                const nextValue = clamped === range.min ? '' : String(clamped);
                                                if (onFilterValueChange) {
                                                    onFilterValueChange(filter.key, nextValue);
                                                } else {
                                                    onFilterChange(filter.key, nextValue);
                                                }
                                            };

                                            return (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                                        <span>{range.min}{range.unit ?? ''}</span>
                                                        <span className="text-sm font-semibold text-black">{currentValue}{range.unit ?? ''}</span>
                                                        <span>{range.max}{range.unit ?? ''}</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min={range.min}
                                                        max={range.max}
                                                        step={range.step}
                                                        value={currentValue}
                                                        onChange={(event) => handleRangeChange(Number(event.target.value))}
                                                        onWheel={(event) => {
                                                            event.preventDefault();
                                                            const direction = event.deltaY < 0 ? 1 : -1;
                                                            handleRangeChange(currentValue + direction * range.step);
                                                        }}
                                                        className="w-full accent-black"
                                                    />
                                                    <p className="text-xs text-gray-400">
                                                        {language === 'th' ? 'เลื่อนเมาส์เพื่อปรับ' : 'Scroll to adjust'}
                                                    </p>
                                                </div>
                                            );
                                        })() : filter.type === 'color' ? (
                                            <div className="flex flex-wrap gap-2">
                                                {(filter.options ?? []).map(option => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => onFilterChange(filter.key, option.value)}
                                                        className={`w-8 h-8 rounded-full border-2 transition-all ${(activeFilters[filter.key] || []).includes(option.value)
                                                            ? 'border-black scale-110'
                                                            : 'border-gray-200'
                                                            }`}
                                                        style={{ backgroundColor: option.value }}
                                                        title={language === 'th' && option.labelTh ? option.labelTh : option.label}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {(filter.options ?? []).map(option => (
                                                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={(activeFilters[filter.key] || []).includes(option.value)}
                                                            onChange={() => onFilterChange(filter.key, option.value)}
                                                            className="w-5 h-5 accent-black"
                                                        />
                                                        <span>{language === 'th' && option.labelTh ? option.labelTh : option.label}</span>
                                                        {option.count !== undefined && (
                                                            <span className="text-xs text-gray-400">({option.count})</span>
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Sort */}
                                <div className="mb-6">
                                    <h3 className="font-semibold mb-3">
                                        {language === 'th' ? 'เรียงตาม' : 'Sort By'}
                                    </h3>
                                    <div className="space-y-2">
                                        {sortOptions.map(option => (
                                            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="sort"
                                                    checked={sortValue === option.value}
                                                    onChange={() => onSortChange(option.value)}
                                                    className="w-5 h-5 accent-black"
                                                />
                                                <span>{language === 'th' ? option.labelTh : option.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-4 border-t">
                                    <button
                                        onClick={onClearAll}
                                        className="flex-1 py-3 border border-gray-300 rounded-lg font-medium"
                                    >
                                        {language === 'th' ? 'ล้าง' : 'Clear'}
                                    </button>
                                    <button
                                        onClick={() => setIsMobileFilterOpen(false)}
                                        className="flex-1 py-3 bg-black text-white rounded-lg font-medium"
                                    >
                                        {language === 'th' ? 'ดูผลลัพธ์' : 'View Results'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

// Default sort options that can be reused
export const defaultSortOptions: SortOption[] = [
    { value: 'featured', label: 'Featured', labelTh: 'แนะนำ' },
    { value: 'newest', label: 'Newest', labelTh: 'ใหม่ล่าสุด' },
    { value: 'price-low', label: 'Price: Low → High', labelTh: 'ราคา: ต่ำ → สูง' },
    { value: 'price-high', label: 'Price: High → Low', labelTh: 'ราคา: สูง → ต่ำ' },
    { value: 'bestseller', label: 'Best Sellers', labelTh: 'ขายดี' },
];

// Common color options
export const colorFilterOptions: FilterOption[] = [
    { value: '#000000', label: 'Black', labelTh: 'ดำ' },
    { value: '#ffffff', label: 'White', labelTh: 'ขาว' },
    { value: '#1e3a5f', label: 'Navy', labelTh: 'กรม' },
    { value: '#dc2626', label: 'Red', labelTh: 'แดง' },
    { value: '#3b82f6', label: 'Blue', labelTh: 'น้ำเงิน' },
    { value: '#22c55e', label: 'Green', labelTh: 'เขียว' },
    { value: '#f97316', label: 'Orange', labelTh: 'ส้ม' },
    { value: '#ec4899', label: 'Pink', labelTh: 'ชมพู' },
    { value: '#6b7280', label: 'Gray', labelTh: 'เทา' },
    { value: '#eab308', label: 'Yellow', labelTh: 'เหลือง' },
];

// Helper hook for filter state management
export function useProductFilters(initialFilters: ActiveFilters = {}) {
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(initialFilters);
    const [sortBy, setSortBy] = useState('featured');

    const toggleFilter = (filterKey: string, value: string) => {
        setActiveFilters(prev => {
            const current = prev[filterKey] || [];
            const updated = current.includes(value)
                ? current.filter(v => v !== value)
                : [...current, value];
            return { ...prev, [filterKey]: updated };
        });
    };

    const clearAllFilters = () => {
        setActiveFilters({});
    };

    const setFilterValue = (filterKey: string, value: string) => {
        setActiveFilters(prev => {
            if (!value) {
                const { [filterKey]: _removed, ...rest } = prev;
                return rest;
            }
            return { ...prev, [filterKey]: [value] };
        });
    };

    return {
        activeFilters,
        sortBy,
        toggleFilter,
        setSortBy,
        clearAllFilters,
        setFilterValue
    };
}
