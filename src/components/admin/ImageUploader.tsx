'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon, Loader2, GripVertical } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImageUploaderProps {
    images: string[];
    onChange: (images: string[]) => void;
    maxImages?: number;
}

export default function ImageUploader({
    images,
    onChange,
    maxImages = 10,
}: ImageUploaderProps) {
    const { language } = useLanguage();
    const t = (en: string, th: string) => (language === 'th' ? th : en);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const uploadFiles = async (files: File[]) => {
        if (files.length === 0) return;

        const remainingSlots = maxImages - images.length;
        if (remainingSlots <= 0) {
            setError(t(`Maximum ${maxImages} images allowed`, `อัปโหลดได้สูงสุด ${maxImages} รูป`));
            return;
        }

        const filesToUpload = files.slice(0, remainingSlots);
        setIsUploading(true);
        setError(null);

        try {
            const formData = new FormData();
            filesToUpload.forEach((file) => {
                formData.append('files', file);
            });

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || t('Upload failed', 'อัปโหลดไม่สำเร็จ'));
            }

            if (data.urls && data.urls.length > 0) {
                onChange([...images, ...data.urls]);
            }

            if (data.errors && data.errors.length > 0) {
                setError(data.errors.join(', '));
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('Upload failed', 'อัปโหลดไม่สำเร็จ'));
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files).filter((file) =>
            file.type.startsWith('image/')
        );
        await uploadFiles(files);
    }, [images, maxImages, onChange]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        await uploadFiles(files);
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    const handleImageDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleImageDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedImage);
        onChange(newImages);
        setDraggedIndex(index);
    };

    const handleImageDragEnd = () => {
        setDraggedIndex(null);
    };

    return (
        <div className="space-y-4">
            {/* Drop Zone */}
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                    relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragging
                        ? 'border-brand-yellow bg-yellow-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    ${isUploading ? 'pointer-events-none opacity-60' : ''}
                `}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-10 h-10 text-brand-yellow animate-spin" />
                        <p className="text-gray-600">{t('Uploading...', 'กำลังอัพโหลด...')}</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-2">
                        <Upload className="w-10 h-10 text-gray-400" />
                        <p className="text-gray-600">
                            {t('Drag files here or', 'ลากไฟล์มาวางที่นี่ หรือ')}{' '}
                            <span className="text-brand-yellow font-medium">
                                {t('click to select', 'คลิกเพื่อเลือก')}
                            </span>
                        </p>
                        <p className="text-sm text-gray-400">
                            {t('JPEG, PNG, WebP, GIF (max 5MB per file)', 'JPEG, PNG, WebP, GIF (สูงสุด 5MB ต่อไฟล์)')}
                        </p>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm"
                >
                    {error}
                </motion.p>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    <AnimatePresence mode="popLayout">
                        {images.map((url, index) => (
                            <motion.div
                                key={url}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                draggable
                                onDragStart={() => handleImageDragStart(index)}
                                onDragOver={(e) => handleImageDragOver(e, index)}
                                onDragEnd={handleImageDragEnd}
                                className={`
                                    relative aspect-square rounded-lg overflow-hidden group
                                    border-2 ${draggedIndex === index ? 'border-brand-yellow' : 'border-transparent'}
                                    cursor-move
                                `}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={url}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    {/* Drag Handle */}
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <GripVertical className="w-5 h-5 text-white" />
                                    </div>
                                    {/* Remove Button */}
                                    <button
                                        onClick={() => removeImage(index)}
                                        className="p-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>

                                {/* Index Badge */}
                                {index === 0 && (
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-brand-yellow text-black text-xs font-medium rounded">
                                    {t('Main', 'หลัก')}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Image Count */}
            <p className="text-sm text-gray-500 text-right">
                {images.length} / {maxImages} {t('images', 'รูป')}
            </p>
        </div>
    );
}
