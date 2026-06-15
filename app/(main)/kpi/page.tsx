import React from "react";
import { FolderView } from "@/components/features/folders/folder-view";

const initialKpiFolders = [
    { id: "1", name: "VIDEO UNIT HDT 785" },
    { id: "2", name: "VIDEO UNIT SKT130S" },
    { id: "3", name: "VIDEO UNIT TRAILER SANY EV TRUCK" },
    { id: "4", name: "VIDEO UNIT BULLDOZER D 155" },
    { id: "5", name: "VIDEO DDT" },
];

export default function KpiPage() {
    return <FolderView title="Video KPI" type="kpi" initialFolders={initialKpiFolders} />;
}
