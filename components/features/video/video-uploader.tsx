"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileVideo, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { getUploadUrlAPI, saveVideoRecordAPI } from "@/services/api";
import axios from "axios";
import { App } from '@capacitor/app';
import { BackgroundTask } from '@capawesome/capacitor-background-task';

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
    const uploadPromiseRef = useRef<Promise<void> | null>(null);

    React.useEffect(() => {
        const listener = App.addListener('appStateChange', async ({ isActive }) => {
            if (!isActive && uploadPromiseRef.current) {
                const taskId = await BackgroundTask.beforeExit(async () => {
                    if (uploadPromiseRef.current) {
                        try { await uploadPromiseRef.current; } catch (e) {}
                    }
                    BackgroundTask.finish({ taskId });
                });
            }
        });
        return () => {
            listener.then(l => l.remove());
        };
    }, []);

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [videoTitle, setVideoTitle] = useState("");
    const [videoThumbnail, setVideoThumbnail] = useState("");
    const [videoDuration, setVideoDuration] = useState("0:00");

    const formatDuration = (seconds: number): string => {
        if (!seconds || isNaN(seconds)) return "\u200B0:00";
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        if (h > 0) {
            return `\u200B${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }
        return `\u200B${m}:${s.toString().padStart(2, '0')}`;
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

    const searchParams = useSearchParams();
    const categoryName = searchParams.get("category") || "Kategori";
    const year = searchParams.get("year") || new Date().getFullYear().toString();
    const type = searchParams.get("type") || "kpi";

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
        
        try {
            const data = await generateVideoData(file);
            setVideoThumbnail(data.thumbnail);
            setVideoDuration(data.durationStr);
        } catch (err) {
            console.error("Video data extraction failed:", err);
        }
    };

    const handleConfirmUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const uploadWork = async () => {
                const urlRes = await getUploadUrlAPI(selectedFile.name);
                if (!urlRes.success || !urlRes.uploadUrl) {
                    throw new Error("Gagal mendapat jalur bypass upload dari Google.");
                }

                const uploadRes = await axios.put(urlRes.uploadUrl, selectedFile, {
                    headers: {
                        'Content-Type': selectedFile.type || 'application/octet-stream',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(percentCompleted >= 99 ? 99 : percentCompleted);
                        }
                    }
                });

                // Google Drive merespons dengan detail file (termasuk ID) setelah upload selesai
                const driveFileId = uploadRes.data?.id;
                const finalDriveUrl = driveFileId ? `https://drive.google.com/file/d/${driveFileId}/view` : "";

                const videoId = Date.now().toString(); 
                
                await saveVideoRecordAPI({
                    id: videoId,
                    title: videoTitle,
                    driveUrl: finalDriveUrl, 
                    thumbnailData: videoThumbnail,
                    duration: videoDuration,
                    category: categoryName,
                    year: year,
                    type: type,
                });

                setUploadProgress(100);

                setTimeout(() => {
                    onUploadComplete({
                        id: videoId,
                        title: videoTitle,
                        thumbnailData: videoThumbnail,
                        videoUrl: URL.createObjectURL(selectedFile), 
                        duration: videoDuration,
                        createdAt: new Date(),
                    });
                    setIsUploading(false);
                    setUploadProgress(0);
                    setSelectedFile(null);
                }, 1000);
            };

            uploadPromiseRef.current = uploadWork();
            await uploadPromiseRef.current;

        } catch (err) {
            console.error("Upload gagal:", err);
            alert("Upload gagal! Silakan coba lagi. Pastikan ID Folder di Apps Script sudah benar.");
            setIsUploading(false);
            setUploadProgress(0);
        } finally {
            uploadPromiseRef.current = null;
        }
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

            {!selectedFile ? (
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
            ) : !isUploading ? (
                <div className={`w-full flex flex-col gap-4 p-4 rounded-[20px] border-2 ${isKpi ? 'border-primary/30 bg-primary/5' : 'border-secondary/30 bg-secondary/5'} animate-in fade-in zoom-in-95 duration-300`}>
                    <div className="flex gap-4 items-center">
                        {videoThumbnail ? (
                            <img src={videoThumbnail} className="w-16 h-16 rounded-xl object-cover border border-surface-dim" alt="Thumb" />
                        ) : (
                            <div className="w-16 h-16 rounded-xl bg-surface-dim flex items-center justify-center">
                                <FileVideo size={24} className="text-on-surface-variant" />
                            </div>
                        )}
                        <div className="flex-1">
                            <label className="text-[12px] font-bold text-on-surface-variant mb-1 block">Nama Video</label>
                            <input 
                                type="text" 
                                value={videoTitle}
                                onChange={(e) => setVideoTitle(e.target.value)}
                                className="w-full bg-surface rounded-lg px-3 py-2 text-[14px] font-bold text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm border border-surface-dim"
                                placeholder="Ketik nama video..."
                            />
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="ghost" className="flex-1 h-10 text-on-surface-variant border border-surface-dim bg-surface hover:bg-surface-dim" onClick={() => setSelectedFile(null)}>Batal</Button>
                        <Button className={`flex-1 h-10 ${themeColorClass} text-white font-bold`} onClick={handleConfirmUpload}>Mulai Upload</Button>
                    </div>
                </div>
            ) : (
                <div className={`w-full flex items-center gap-4 p-4 rounded-[20px] border-2 ${isKpi ? 'border-primary/20 bg-primary/5' : 'border-secondary/20 bg-secondary/5'}`}>
                    {uploadProgress < 100 ? (
                        <>
                            <Loader2 size={24} className={`animate-spin shrink-0 ${themeTextClass}`} />
                            <div className="flex-1 flex flex-col items-start">
                                <div className="flex justify-between w-full mb-1.5">
                                    <span className="font-bold text-[13px] text-on-surface line-clamp-1">{videoTitle}</span>
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
