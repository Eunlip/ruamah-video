"use client";

import React, { useEffect, useState } from "react";
import packageJson from "../../../package.json";
import { DownloadCloud } from "lucide-react";

interface UpdateData {
    latestVersion: string;
    mandatory: boolean;
    updateMessage: string;
    downloadUrl: string;
}

// Fungsi sederhana untuk membandingkan versi semver (misal: 1.0.1 > 1.0.0)
const isNewerVersion = (latest: string, current: string) => {
    const lParts = latest.split(".").map(Number);
    const cParts = current.split(".").map(Number);
    for (let i = 0; i < Math.max(lParts.length, cParts.length); i++) {
        const l = lParts[i] || 0;
        const c = cParts[i] || 0;
        if (l > c) return true;
        if (l < c) return false;
    }
    return false;
};

export function UpdateChecker() {
    const [updateData, setUpdateData] = useState<UpdateData | null>(null);

    useEffect(() => {
        const checkForUpdates = async () => {
            try {
                // Di mode production, ini harus diganti dengan URL public tempat Anda meng-host version.json
                // Contoh: const url = "https://rumah-video.vercel.app/version.json"
                const url = process.env.NODE_ENV === "development" 
                    ? "/version.json" 
                    : "https://rumah-video.vercel.app/version.json";
                
                // Tambahkan parameter timestamp untuk mencegah cache dari browser
                const response = await fetch(`${url}?t=${new Date().getTime()}`);
                if (!response.ok) return;

                const data: UpdateData = await response.json();
                const currentVersion = packageJson.version;

                if (isNewerVersion(data.latestVersion, currentVersion)) {
                    setUpdateData(data);
                }
            } catch (error) {
                console.error("Gagal mengecek update:", error);
            }
        };

        checkForUpdates();
    }, []);

    if (!updateData) return null;

    return (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="bg-surface-container-lowest w-full max-w-sm rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-500 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                    <DownloadCloud size={40} className="text-primary animate-bounce" />
                </div>
                
                <h2 className="text-2xl font-display font-bold text-on-surface mb-2">
                    Update Tersedia!
                </h2>
                <div className="inline-block bg-surface-container px-3 py-1 rounded-full mb-6">
                    <p className="text-sm font-bold text-primary">
                        Versi {updateData.latestVersion}
                    </p>
                </div>
                
                <p className="text-on-surface-variant mb-8 text-[15px] leading-relaxed">
                    {updateData.updateMessage}
                </p>

                <a 
                    href={updateData.downloadUrl}
                    className="w-full flex items-center justify-center py-4 bg-primary text-on-primary rounded-2xl font-bold text-[16px] hover:bg-primary/90 transition-colors shadow-lg shadow-primary/30"
                >
                    Download Sekarang
                </a>

                {!updateData.mandatory && (
                    <button 
                        onClick={() => setUpdateData(null)}
                        className="mt-4 text-on-surface-variant text-sm font-bold hover:text-on-surface transition-colors"
                    >
                        Nanti Saja
                    </button>
                )}
            </div>
        </div>
    );
}
