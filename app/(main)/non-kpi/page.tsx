import React from "react";
import { FolderView } from "@/components/features/folders/folder-view";

const initialNonKpiFolders = [
    { id: "1", name: "VIDEO EDUKASI KELUARGA", year: "2025" },
    { id: "2", name: "VIDEO EDUKASI KELUARGA", year: "2026" },
    { id: "3", name: "VIDEO HR BERGERAK TAHUN", year: "2025" },
    { id: "4", name: "VIDEO HR BERGERAK TAHUN", year: "2026" },
    { id: "5", name: "VIDEO HR IN CINEMA" },
    { id: "6", name: "VIDEO HOT SEAT COUNSELOR" },
];

export default function NonKpiPage() {
    return <FolderView title="Video Non-KPI" type="non-kpi" initialFolders={initialNonKpiFolders} />;
}
