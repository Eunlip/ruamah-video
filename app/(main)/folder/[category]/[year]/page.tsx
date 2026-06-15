"use client";

import React, { useState } from "react";
import { ArrowLeft, Video, Clock } from "lucide-react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { VideoUploader } from "@/components/features/video/video-uploader";

interface VideoItem {
    id: string;
    title: string;
    thumbnailData: string;
    duration?: string;
    createdAt: Date;
}

export default function FolderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const searchParams = useSearchParams();
    
    const categoryName = decodeURIComponent(params.category as string);
    const year = params.year as string;
    const type = searchParams.get('type') || 'kpi';
    
    const [videos, setVideos] = useState<VideoItem[]>([]);
    
    const isKpi = type === "kpi";

    const handleVideoUploaded = (video: VideoItem) => {
        setVideos(prev => [video, ...prev]);
    };

    return (
        <div className="flex flex-col min-h-[100dvh] bg-surface pb-24">
            {/* Header */}
            <header className={`sticky top-0 z-20 pt-12 pb-4 px-5 flex items-center shadow-md transition-colors duration-300 ${isKpi ? 'bg-primary' : 'bg-secondary'} text-white`}>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => router.back()}
                        className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-display text-[15px] font-bold tracking-tight opacity-80 uppercase leading-tight line-clamp-1">
                            {categoryName}
                        </h1>
                        <h2 className="font-display text-2xl font-bold tracking-tight leading-none mt-1">
                            Tahun {year}
                        </h2>
                    </div>
                </div>
            </header>

            <main className="flex-1 px-5 pt-6">
                <div className="mb-6">
                    <VideoUploader onUploadComplete={handleVideoUploaded} isKpi={isKpi} />
                </div>

                <div className="mt-8">
                    <h3 className="font-sans font-bold text-on-surface mb-4 flex items-center gap-2">
                        <Video size={20} className={isKpi ? 'text-primary' : 'text-secondary'} />
                        Video Tersimpan ({videos.length})
                    </h3>

                    {videos.length === 0 ? (
                        <div className="text-center py-12 px-4 bg-surface-container-lowest rounded-[20px] border border-surface-dim/50 border-dashed">
                            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${isKpi ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                                <Video size={32} />
                            </div>
                            <p className="font-bold text-on-surface mb-1">Belum ada video</p>
                            <p className="text-sm text-on-surface-variant">
                                Upload video pertama untuk folder ini.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {videos.map(video => (
                                <div key={video.id} className="bg-surface-container-lowest border border-surface-dim rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer">
                                    <div className="aspect-video bg-black relative w-full overflow-hidden">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img 
                                            src={video.thumbnailData} 
                                            alt={video.title} 
                                            className="w-full h-full object-cover"
                                        />
                                        {video.duration && (
                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 backdrop-blur-sm">
                                                <Clock size={10} />
                                                {video.duration}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                                                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[14px] border-l-white border-b-8 border-b-transparent ml-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-sans font-bold text-on-surface text-[14px] leading-tight line-clamp-2 mb-1">
                                            {video.title}
                                        </h4>
                                        <p className="text-[11px] text-on-surface-variant">
                                            Diunggah: {video.createdAt.toLocaleDateString('id-ID')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
