import axios from "axios";

export const GAS_WEB_APP_URL =
    "https://script.google.com/macros/s/AKfycbyAVlO_ps1E21d9U6A5Yq57pcyxIdWqtPOhdIaxLTzblKHsvmboxIigWiD_haXhKUID/exec";

export interface VideoRecordPayload {
    id: string;
    title: string;
    driveUrl?: string;
    duration?: string;
    category: string;
    year: string;
    type: string;
    thumbnailData?: string;
}

export async function loginAPI(nrp: string, password: string) {
    try {
        const url = `${GAS_WEB_APP_URL}?action=login&nrp=${encodeURIComponent(
            nrp,
        )}&password=${encodeURIComponent(password)}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("API Login Error:", error);
        return {
            success: false,
            error: "Gagal terhubung ke server. Pastikan URL sudah benar.",
        };
    }
}

export async function getVideosAPI() {
    try {
        const url = `${GAS_WEB_APP_URL}?action=getVideos`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("API Get Videos Error:", error);
        return { success: false, data: [] };
    }
}

export async function getUploadUrlAPI(fileName: string) {
    try {
        // Ambil origin aplikasi (misal http://localhost:3000 atau http://localhost)
        const origin = typeof window !== 'undefined' ? window.location.origin : "*";
        
        // Build query params
        const params = new URLSearchParams({
            action: "getUploadUrl",
            fileName: fileName,
            origin: origin
        });

        // Pakai Axios
        const response = await axios.get(`${GAS_WEB_APP_URL}?${params.toString()}`);
        return response.data;
    } catch (error) {
        console.error("getUploadUrlAPI error:", error);
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat memanggil API";
        return { success: false, error: errorMessage };
    }
}

export async function saveVideoRecordAPI(videoData: VideoRecordPayload) {
    try {
        const response = await fetch(GAS_WEB_APP_URL + "?action=saveRecord", {
            method: "POST",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
            },
            body: JSON.stringify(videoData)
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Save Record Error:", error);
        return {
            success: false,
            error: "Gagal menyimpan catatan ke database.",
        };
    }
}

export async function deleteVideoAPI(id: string) {
    try {
        const url = `${GAS_WEB_APP_URL}?action=deleteVideo&id=${encodeURIComponent(id)}`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("API Delete Video Error:", error);
        return { success: false, error: "Gagal menghapus video." };
    }
}
