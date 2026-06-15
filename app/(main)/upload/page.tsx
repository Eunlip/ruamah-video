import React from "react";

export default function UploadPage() {
    return (
        <div className="flex flex-col min-h-screen pt-8 px-6 pb-24">
            <header className="mb-8">
                <h1 className="font-display text-3xl font-bold text-on-surface">Upload</h1>
                <p className="text-on-surface-variant mt-2 text-sm">
                    Unggah video baru.
                </p>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-surface-dim rounded-2xl bg-surface-container-lowest">
                <div className="w-16 h-16 bg-surface-container rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary text-2xl">+</span>
                </div>
                <p className="text-on-surface font-semibold">Pilih Video</p>
                <p className="text-on-surface-variant text-sm mt-1">MP4, WebM (Max 50MB)</p>
            </div>
        </div>
    );
}
