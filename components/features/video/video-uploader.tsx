"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileVideo, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoItem {
    id: string;
    title: string;
    thumbnailData: string;
    videoUrl?: string;
    duration?: string;
    createdAt: Date;
}

interface VideoUploaderProps {
    onUploadComplete: (video: VideoItem) => void;
    isKpi: boolean;
}

export function VideoUploader({ onUploadComplete, isKpi }: VideoUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const formatDuration = (seconds: number): string => {
        if (!seconds || isNaN(seconds)) return "0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const generateVideoData = (file: File): Promise<{thumbnail: string, durationStr: string}> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.muted = true;
            video.playsInline = true;

            const url = URL.createObjectURL(file);
            video.src = url;

            video.onloadedmetadata = () => {
                // Seek to 1 second or halfway if very short
                video.currentTime = Math.min(1, video.duration / 2);
            };

            video.onseeked = () => {
                const canvas = document.createElement("canvas");
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext("2d");
                
                if (ctx) {
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const dataUrl = canvas.toDataURL("image/jpeg", 0.7);
                    URL.revokeObjectURL(url);
                    resolve({
                        thumbnail: dataUrl,
                        durationStr: formatDuration(video.duration)
                    });
                } else {
                    reject(new Error("Cannot get canvas context"));
                }
            };

            video.onerror = () => {
                reject(new Error("Failed to load video"));
            };
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setUploadProgress(0);

        // 1. Generate thumbnail and duration first
        let thumbnail = "";
        let durationStr = "0:00";
        try {
            const data = await generateVideoData(file);
            thumbnail = data.thumbnail;
            durationStr = data.durationStr;
        } catch (err) {
            console.error("Video data extraction failed:", err);
            // Fallback placeholder logic could go here
        }

        // 2. Simulate network upload progress
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 95) {
                    clearInterval(interval);
                    return prev;
                }
                return prev + Math.floor(Math.random() * 15) + 5;
            });
        }, 300);

        // 3. Complete the fake upload after 2-3 seconds
        setTimeout(() => {
            clearInterval(interval);
            setUploadProgress(100);
            
            setTimeout(() => {
                onUploadComplete({
                    id: Date.now().toString(),
                    title: file.name.replace(/\.[^/.]+$/, ""), // remove extension
                    thumbnailData: thumbnail,
                    videoUrl: URL.createObjectURL(file), // Simpan URL video agar bisa diputar
                    duration: durationStr, // Menggunakan durasi asli video
                    createdAt: new Date()
                });
                setIsUploading(false);
                setUploadProgress(0);
            }, 500); // Small delay to show 100% state
        }, 2500);
    };

    const themeColorClass = isKpi ? "bg-primary" : "bg-secondary";
    const themeTextClass = isKpi ? "text-primary" : "text-secondary";
    const themeBorderClass = isKpi ? "border-primary" : "border-secondary";

    return (
        <div className="w-full">
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileSelect} 
                accept="video/*" 
                className="hidden" 
            />

            {!isUploading ? (
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`w-full flex items-center gap-4 p-4 rounded-[20px] border-2 border-dashed transition-all active:scale-[0.98]
                    ${isKpi ? 'border-primary/30 hover:border-primary/60 bg-primary/5' : 'border-secondary/30 hover:border-secondary/60 bg-secondary/5'}
                    `}
                >
                    <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center shadow-sm ${themeColorClass} text-white`}>
                        <UploadCloud size={24} />
                    </div>
                    <div className="flex flex-col items-start text-left flex-1">
                        <span className="font-display font-bold text-[15px] text-on-surface leading-tight">
                            Upload Video Baru
                        </span>
                        <span className="text-[12px] font-sans text-on-surface-variant line-clamp-1 mt-0.5">
                            Pilih video dari galeri
                        </span>
                    </div>
                </button>
            ) : (
                <div className={`w-full flex items-center gap-4 p-4 rounded-[20px] border-2 ${isKpi ? 'border-primary/20 bg-primary/5' : 'border-secondary/20 bg-secondary/5'}`}>
                    {uploadProgress < 100 ? (
                        <>
                            <Loader2 size={24} className={`animate-spin shrink-0 ${themeTextClass}`} />
                            <div className="flex-1 flex flex-col items-start">
                                <div className="flex justify-between w-full mb-1.5">
                                    <span className="font-bold text-[13px] text-on-surface">Mengunggah...</span>
                                    <span className={`text-[13px] font-bold ${themeTextClass}`}>{uploadProgress}%</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-surface-dim rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-300 ${themeColorClass}`}
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3 w-full animate-in fade-in duration-300">
                            <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${themeColorClass} text-white`}>
                                <CheckCircle2 size={24} />
                            </div>
                            <span className="font-bold text-[15px] text-on-surface">Upload Selesai!</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
