"use client";

import { ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface BreadcrumbItem {
    label: string;
    labelTh?: string;
    href?: string;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const { language } = useLanguage();

    return (
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-4">
            <a href="/" className="hover:text-white transition-colors">
                {language === 'th' ? 'หน้าแรก' : 'HOME'}
            </a>
            {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                    <ChevronRight size={14} />
                    {item.href ? (
                        <a href={item.href} className="hover:text-white transition-colors">
                            {language === 'th' && item.labelTh ? item.labelTh : item.label}
                        </a>
                    ) : (
                        <span className="text-gray-300">
                            {language === 'th' && item.labelTh ? item.labelTh : item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
}
