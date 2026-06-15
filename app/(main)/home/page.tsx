import React from "react";
import Link from "next/link";
import { Target, Compass, ArrowRight } from "lucide-react";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-[100dvh] relative overflow-hidden bg-surface">
            {/* Playful Background Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-secondary/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute top-[20%] left-[-20%] w-[250px] h-[250px] bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full pt-8 px-5 pb-20">
                <header className="mb-6">
                    <h1 className="font-display text-[28px] font-[800] text-on-surface leading-tight tracking-tight">
                        Pilih Kategori
                    </h1>
                    <p className="text-on-surface-variant mt-1 text-[15px] font-sans">
                        Mau kelola video yang mana hari ini?
                    </p>
                </header>

                <div className="flex-1 flex flex-col gap-4">
                    {/* KPI Card */}
                    <Link href="/kpi" className="relative group block flex-1">
                        {/* Shadow layer for 3D effect */}
                        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-[28px] translate-y-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative h-full flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#433fe5] via-[#5d5cff] to-[#8127cf] rounded-[28px] p-5 text-white shadow-[0_16px_32px_-10px_rgba(67,63,229,0.4)] transition-all duration-300 group-active:scale-[0.97] border border-white/20">
                            {/* Inner highlight for "pillowed" 3D look */}
                            <div className="absolute inset-0 rounded-[28px] border-t-2 border-white/30 pointer-events-none" />

                            {/* Decorative background shapes */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 ease-out" />
                            <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <Target size={110} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mb-3 border border-white/30 shadow-inner">
                                    <Target
                                        size={24}
                                        className="text-white drop-shadow-md"
                                    />
                                </div>
                                <h2 className="font-display text-[24px] font-bold mb-1 tracking-tight">
                                    Video KPI
                                </h2>
                                <p className="text-white/90 text-[14px] leading-snug font-sans mb-4 max-w-[85%]">
                                    Kelola konten video yang masuk dalam Key Performance Indicator.
                                </p>
                            </div>
                            
                            <div className="relative z-10 flex items-center justify-between mt-auto">
                                <div className="flex items-center text-[13px] font-bold bg-white text-primary px-4 py-2 rounded-full shadow-[0_8px_16px_-4px_rgba(0,0,0,0.2)] group-hover:shadow-[0_12px_20px_-4px_rgba(0,0,0,0.3)] group-hover:-translate-y-0.5 transition-all">
                                    Buka KPI
                                </div>
                                <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-colors">
                                    <ArrowRight
                                        size={18}
                                        className="text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* NON KPI Card */}
                    <Link href="/non-kpi" className="relative group block flex-1">
                        <div className="relative h-full flex flex-col justify-between overflow-hidden bg-white/80 backdrop-blur-xl rounded-[28px] p-5 text-on-surface border border-surface-dim hover:border-primary/30 shadow-[0_12px_32px_-10px_rgba(210,217,244,0.8)] hover:shadow-[0_20px_40px_-10px_rgba(67,63,229,0.15)] transition-all duration-300 group-active:scale-[0.97]">
                            <div className="absolute inset-0 rounded-[28px] border-t-2 border-white pointer-events-none" />

                            {/* Decorative background shape */}
                            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-surface-container-high/50 rounded-full blur-xl group-hover:bg-primary/5 transition-colors duration-500" />
                            <div className="absolute top-0 right-0 p-4 opacity-[0.03] transform translate-x-4 group-hover:-translate-y-2 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">
                                <Compass size={110} strokeWidth={1} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-surface-container rounded-2xl flex items-center justify-center mb-3 border border-surface-container-high shadow-inner">
                                    <Compass
                                        size={24}
                                        className="text-primary"
                                    />
                                </div>
                                <h2 className="font-display text-[24px] font-bold mb-1 text-primary tracking-tight">
                                    Video Non-KPI
                                </h2>
                                <p className="text-on-surface-variant text-[14px] leading-snug font-sans mb-4 max-w-[85%]">
                                    Kumpulan video pelengkap, dokumentasi, dan konten tambahan.
                                </p>
                            </div>
                            
                            <div className="relative z-10 flex items-center justify-between mt-auto">
                                <div className="flex items-center text-[13px] font-bold text-primary px-4 py-2 rounded-full border border-primary/20 bg-primary/5 group-hover:bg-primary group-hover:text-white transition-colors">
                                    Buka Non-KPI
                                </div>
                                <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary transition-colors">
                                    <ArrowRight
                                        size={18}
                                        className="text-on-surface-variant group-hover:text-white transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
