"use client";

import React, { useState, useEffect, Suspense } from "react";
import { ArrowLeft, Video, Clock, X, Search, Trash2, Download, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { VideoUploader } from "@/components/features/video/video-uploader";
import { useLongPress } from "@/hooks/use-long-press";
import { getVideosAPI } from "@/services/api";

interface VideoItem {
    id: string;
    title: string;
    thumbnailData: string;
    videoUrl?: string;
    duration?: string;
    createdAt: Date;
}

function VideoCard({
    video,
    isDeleting = false,
    onPlay,
    onLongPress,
}: {
    video: VideoItem;
    isDeleting?: boolean;
    onPlay: () => void;
    onLongPress: () => void;
}) {
    const longPressProps = useLongPress(
        () => onLongPress(),
        () => onPlay(),
    );

    return (
        <div
            {...longPressProps}
            className="relative w-full aspect-video rounded-[24px] overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer group select-none bg-surface-container"
        >
            {/* Full Thumbnail Image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={video.thumbnailData.startsWith("dummy") ? "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80" : video.thumbnailData}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Gradient Backdrop Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

            {/* Duration Badge */}
            {video.duration && (
                <div className="absolute top-4 right-4 bg-black/60 text-white text-[12px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 backdrop-blur-md">
                    <Clock size={12} />
                    {video.duration}
                </div>
            )}

            {/* Title and Date Content */}
            <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 className="font-sans font-bold text-white text-[17px] leading-tight line-clamp-2 mb-1.5 drop-shadow-md">
                    {video.title}
                </h4>
                <p className="text-[13px] text-white/80 font-medium flex items-center gap-1.5">
                    <Video size={14} />
                    Diunggah:{" "}
                    {video.createdAt.toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
            </div>

            {/* Play Button Overlay (Hover & Center) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform duration-300 pointer-events-none">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[16px] border-l-white border-b-8 border-b-transparent ml-1 drop-shadow-lg"></div>
                </div>
            </div>

            {/* Deleting Overlay */}
            {isDeleting && (
                <div className="absolute inset-0 bg-surface/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                    <Loader2 className="w-10 h-10 animate-spin text-error mb-2" />
                    <p className="text-on-surface font-bold text-sm animate-pulse">Menghapus...</p>
                </div>
            )}
        </div>
    );
}

function FolderDetailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryName = searchParams.get("category") || "Kategori";
    const year = searchParams.get("year") || new Date().getFullYear().toString();
    const type = searchParams.get("type") || "kpi";

    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isDeletingVideo, setIsDeletingVideo] = useState<string | null>(null);
    const [playingVideo, setPlayingVideo] = useState<VideoItem | null>(null);
    const [actionSheetVideo, setActionSheetVideo] = useState<VideoItem | null>(null);
    const [userRole, setUserRole] = useState<string>("viewer");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                const userObj = JSON.parse(storedUser);
                setTimeout(() => {
                    setUserRole(userObj.role?.toLowerCase() || "viewer");
                }, 0);
            } catch (e) {}
        }
    }, []);

    // Search state
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fetch real data from server
    useEffect(() => {
        const fetchVideos = async () => {
            setIsLoadingData(true);
            const res = await getVideosAPI();
            if (res.success && res.data) {
                interface ApiVideo {
                    id: string;
                    category: string;
                    year: string | number;
                    type: string;
                    title: string;
                    thumbnailData?: string;
                    driveUrl?: string;
                    duration?: string;
                    createdAt?: string;
                }
                const filtered = res.data.filter((v: ApiVideo) => 
                    String(v.category) === String(categoryName) &&
                    String(v.year) === String(year) &&
                    String(v.type).toLowerCase() === String(type).toLowerCase()
                ).map((v: ApiVideo) => ({
                    id: String(v.id),
                    title: v.title,
                    thumbnailData: v.thumbnailData || "dummy",
                    videoUrl: v.driveUrl,
                    duration: v.duration,
                    createdAt: new Date(v.createdAt || Date.now()),
                }));
                setVideos(filtered);
            }
            setIsLoadingData(false);
        };
        fetchVideos();
    }, [categoryName, year, type]);

    const isKpi = type === "kpi";

    const handleVideoUploaded = (video: VideoItem) => {
        setVideos((prev) => [video, ...prev]);
    };

    const handleDeleteVideo = async (id: string) => {
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus video ini secara permanen?");
        if (!confirmDelete) return;

        setActionSheetVideo(null);
        setIsDeletingVideo(id);

        try {
            const { deleteVideoAPI } = await import("@/services/api");
            const res = await deleteVideoAPI(id);
            if (res.success) {
                setVideos((prev) => prev.filter((v) => v.id !== id));
            } else {
                alert("Gagal menghapus video: " + res.error);
            }
        } catch (error) {
            alert("Terjadi kesalahan saat menghapus video.");
        } finally {
            setIsDeletingVideo(null);
        }
    };

    const handleSaveVideo = (video: VideoItem) => {
        if (!video.videoUrl) {
            alert("URL Video tidak ditemukan.");
            return;
        }
        setActionSheetVideo(null);
        
        // Ekstrak ID dari URL Google Drive
        const match = video.videoUrl.match(/\/d\/(.+?)\//);
        if (match && match[1]) {
            const fileId = match[1];
            // Paksa download file Google Drive
            window.open(`https://drive.google.com/uc?export=download&id=${fileId}`, '_blank');
        } else {
            // Jika ini adalah Blob URL (video yang baru saja di-upload tapi belum di-refresh)
            const a = document.createElement("a");
            a.href = video.videoUrl;
            a.download = `${video.title}.mp4`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    interface WebkitDocument extends Document {
        webkitFullscreenElement?: Element;
    }

    interface WebkitHTMLVideoElement extends HTMLVideoElement {
        webkitRequestFullscreen?: () => Promise<void>;
        webkitEnterFullscreen?: () => void;
    }

    // Auto close modal when exiting fullscreen
    React.useEffect(() => {
        const handleFullscreenChange = () => {
            if (
                !document.fullscreenElement &&
                !(document as WebkitDocument).webkitFullscreenElement
            ) {
                setPlayingVideo(null);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        document.addEventListener(
            "webkitfullscreenchange",
            handleFullscreenChange,
        );

        return () => {
            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange,
            );
            document.removeEventListener(
                "webkitfullscreenchange",
                handleFullscreenChange,
            );
        };
    }, []);

    const handlePlayVideo = (video: VideoItem) => {
        setPlayingVideo(video);

        // Request native fullscreen
        setTimeout(() => {
            const videoEl = document.getElementById(
                "main-video-player",
            ) as WebkitHTMLVideoElement;
            if (videoEl) {
                if (videoEl.requestFullscreen) {
                    videoEl
                        .requestFullscreen()
                        .catch((e) => console.log("Fullscreen failed:", e));
                } else if (videoEl.webkitRequestFullscreen) {
                    videoEl.webkitRequestFullscreen();
                } else if (videoEl.webkitEnterFullscreen) {
                    // iOS Safari fallback
                    videoEl.webkitEnterFullscreen();
                }

                // Try to force landscape if it's a landscape video (width > height)
                // This relies on the metadata being loaded, but as a best-effort:
                videoEl.onloadedmetadata = () => {
                    if (videoEl.videoWidth > videoEl.videoHeight) {
                        try {
                            interface LockableScreenOrientation
                                extends ScreenOrientation {
                                lock?: (
                                    orientation: "landscape",
                                ) => Promise<void>;
                            }
                            const orientation =
                                screen.orientation as LockableScreenOrientation;
                            if (orientation && orientation.lock) {
                                orientation.lock("landscape").catch(() => {});
                            }
                        } catch (e) {}
                    }
                };
            }
        }, 50);
    };

    const filteredVideos = videos.filter((v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
        <div className="flex flex-col min-h-[100dvh] bg-surface pb-24">
            {/* Header */}
            <header
                className={`sticky top-0 z-20 pt-8 pb-4 px-5 flex items-center shadow-md transition-colors duration-300 ${
                    isKpi ? "bg-primary" : "bg-secondary"
                } text-white`}
            >
                {isSearchActive ? (
                    <div className="flex w-full items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            onClick={() => {
                                setIsSearchActive(false);
                                setSearchQuery("");
                            }}
                            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <input
                            autoFocus
                            type="text"
                            placeholder="Cari video..."
                            className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/70 text-[18px] font-sans h-full py-2"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="flex w-full items-center justify-between">
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
                        <button
                            onClick={() => setIsSearchActive(true)}
                            className="p-2 -mr-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <Search size={24} />
                        </button>
                    </div>
                )}
            </header>

            <main className="flex-1 px-5 pt-6">
                {userRole === "editor" && (
                    <div className="mb-6">
                        <VideoUploader
                            onUploadComplete={handleVideoUploaded}
                            isKpi={isKpi}
                        />
                    </div>
                )}

                <div className="mt-8">
                    <h3 className="font-sans font-bold text-on-surface mb-4 flex items-center gap-2">
                        <Video
                            size={20}
                            className={
                                isKpi ? "text-primary" : "text-secondary"
                            }
                        />
                        Video Tersimpan ({filteredVideos.length})
                    </h3>

                    <div className="flex-1 relative">
                        {isLoadingData ? (
                            <div className="flex flex-col items-center justify-center py-12 px-4 bg-surface-container-lowest rounded-[20px] text-on-surface-variant border border-surface-dim/50">
                                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                                <p className="font-bold text-on-surface">Memuat data video...</p>
                                <p className="text-sm mt-1 text-center max-w-[80%]">Tunggu sebentar, kami sedang mengambil data dari server.</p>
                            </div>
                        ) : filteredVideos.length === 0 ? (
                            <div className="text-center py-12 px-4 bg-surface-container-lowest rounded-[20px] border border-surface-dim/50 border-dashed">
                                <div
                                    className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ${
                                        isKpi
                                            ? "bg-primary/10 text-primary"
                                            : "bg-secondary/10 text-secondary"
                                    }`}
                                >
                                    <Video size={32} />
                                </div>
                                <p className="font-bold text-on-surface mb-1">
                                    {searchQuery
                                        ? "Video tidak ditemukan"
                                        : "Belum ada video"}
                                </p>
                                <p className="text-sm text-on-surface-variant">
                                    {searchQuery
                                        ? `Tidak ada video dengan nama "${searchQuery}"`
                                        : "Upload video pertama untuk folder ini."}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredVideos.map((video) => (
                                    <VideoCard
                                        key={video.id}
                                        video={video}
                                        isDeleting={isDeletingVideo === video.id}
                                        onPlay={() => setPlayingVideo(video)}
                                        onLongPress={() =>
                                            setActionSheetVideo(video)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Video Player Modal */}
            {playingVideo && playingVideo.videoUrl && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in duration-300">
                    <header className="p-4 pt-safe flex items-center justify-between text-white bg-gradient-to-b from-black/80 to-transparent">
                        <h3 className="font-bold font-sans line-clamp-1 flex-1 pr-4 text-white">
                            {playingVideo.title}
                        </h3>
                        <button
                            onClick={() => setPlayingVideo(null)}
                            className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        >
                            <X size={24} className="text-white" />
                        </button>
                    </header>
                    <div className="flex-1 flex items-center justify-center p-0 sm:p-4">
                        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                        <video
                            id="main-video-player"
                            src={
                                playingVideo.videoUrl.startsWith("blob:")
                                    ? playingVideo.videoUrl
                                    : (playingVideo.videoUrl.match(/\/d\/(.+?)\//)
                                          ? `https://drive.google.com/uc?export=download&id=${playingVideo.videoUrl.match(/\/d\/(.+?)\//)![1]}`
                                          : playingVideo.videoUrl)
                            }
                            controls
                            autoPlay
                            playsInline
                            className="max-w-full max-h-[85vh] w-full object-contain outline-none"
                        />
                    </div>
                </div>
            )}

            {/* Action Sheet Modal (Bottom Sheet for Native feel) */}
            {actionSheetVideo && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center p-0">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
                        onClick={() => setActionSheetVideo(null)}
                    ></div>
                    <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
                        <div className="w-12 h-1.5 bg-surface-dim rounded-full mx-auto mb-6"></div>
                        <h3 className="font-display font-bold text-xl text-on-surface mb-1 line-clamp-1">
                            {actionSheetVideo.title}
                        </h3>
                        <p className="text-sm font-sans text-on-surface-variant mb-6">
                            Pilih tindakan untuk video ini.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => handleSaveVideo(actionSheetVideo)}
                                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary/10 text-primary hover:bg-primary/20 active:bg-primary/30 transition-colors font-bold text-[16px]"
                            >
                                <Download size={20} />
                                Simpan Video
                            </button>
                            {userRole === "editor" && (
                                <button
                                    onClick={() => {
                                        handleDeleteVideo(actionSheetVideo.id);
                                        setActionSheetVideo(null);
                                    }}
                                    className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-500/20 active:bg-red-500/30 transition-colors font-bold text-[16px]"
                                >
                                    <Trash2 size={20} />
                                    Hapus Video
                                </button>
                            )}
                            <button
                                onClick={() => setActionSheetVideo(null)}
                                className="w-full p-4 rounded-2xl text-on-surface font-bold hover:bg-surface-container active:bg-surface-container-high transition-colors text-[16px]"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function FolderDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant">
                    Memuat...
                </div>
            }
        >
            <FolderDetailContent />
        </Suspense>
    );
}
