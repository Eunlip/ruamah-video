import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "export",

    // Wajib karena Capacitor tidak bisa optimasi gambar Next.js
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
