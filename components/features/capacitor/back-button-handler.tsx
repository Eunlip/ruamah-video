"use client";

import { useEffect } from "react";
import { App } from "@capacitor/app";
import { useRouter, usePathname } from "next/navigation";

export function BackButtonHandler() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Hanya berjalan di environment Capacitor (Android/iOS)
        if (typeof window === "undefined") return;

        const setupBackButton = async () => {
            try {
                await App.removeAllListeners();
                await App.addListener("backButton", ({ canGoBack }) => {
                    // Jika user berada di halaman utama atau halaman login,
                    // tombol back fisik akan keluar dari aplikasi (menutup aplikasi)
                    if (pathname === "/home" || pathname === "/profile" || pathname === "/") {
                        App.exitApp();
                    } else {
                        // Jika di halaman lain (seperti /folder), tombol back akan kembali ke halaman sebelumnya
                        router.back();
                    }
                });
            } catch (error) {
                // Abaikan error jika tidak berjalan di environment Capacitor
                console.log("Not running in Capacitor environment");
            }
        };

        setupBackButton();

        return () => {
            try {
                App.removeAllListeners();
            } catch (e) {}
        };
    }, [pathname, router]);

    return null;
}
