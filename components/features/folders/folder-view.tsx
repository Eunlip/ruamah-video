"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Folder, Plus, X, ArrowLeft, Calendar, Search, ChevronDown, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLongPress } from "@/hooks/use-long-press";

interface FolderItem {
    id: string;
    name: string;
    year?: string;
}

interface FolderViewProps {
    title: string;
    type: "kpi" | "non-kpi";
    initialFolders: FolderItem[];
}

interface FolderHeaderProps {
    group: { id: string; name: string; years: string[] };
    isKpi: boolean;
    isExpanded: boolean;
    onClick: () => void;
    onLongPress: () => void;
}

function FolderHeader({ group, isKpi, isExpanded, onClick, onLongPress }: FolderHeaderProps) {
    const props = useLongPress(() => onLongPress(), () => onClick());
    return (
        <div 
            {...props}
            className="p-4 flex items-center gap-4 cursor-pointer active:bg-surface-container-low/50 transition-colors select-none"
        >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br ${isKpi ? 'from-primary/20 to-primary/5 text-primary' : 'from-secondary/20 to-secondary/5 text-secondary'}`}>
                <Folder size={28} fill="currentColor" className="opacity-80" />
            </div>
            <div className="flex flex-col flex-1">
                <h3 className="font-sans font-bold text-on-surface text-[15px] leading-tight">
                    {group.name}
                </h3>
                <span className="text-[13px] text-on-surface-variant font-medium mt-1">
                    {group.years.length > 0 
                        ? `${group.years.length} Tahun Tersedia` 
                        : 'Belum ada tahun'}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-primary/10' : 'bg-transparent'}`}>
                    <ChevronDown size={20} className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : 'text-on-surface-variant/40'}`} />
                </div>
            </div>
        </div>
    );
}

interface YearChipProps {
    year: string;
    isKpi: boolean;
    onClick: () => void;
    onLongPress: () => void;
}

function YearChip({ year, isKpi, onClick, onLongPress }: YearChipProps) {
    const props = useLongPress(() => onLongPress(), () => onClick());
    return (
        <div 
            {...props}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 border select-none ${isKpi ? 'bg-primary/5 border-primary/20 hover:bg-primary hover:text-white text-primary' : 'bg-secondary/5 border-secondary/20 hover:bg-secondary hover:text-white text-secondary'}`}
        >
            <Calendar size={16} />
            <span className="font-bold text-sm">{year}</span>
        </div>
    );
}

export function FolderView({ title, type, initialFolders }: FolderViewProps) {
    const router = useRouter();
    const [folders, setFolders] = useState<FolderItem[]>(initialFolders);
    
    // Action Sheet states
    const [actionSheetFolder, setActionSheetFolder] = useState<{name: string} | null>(null);
    const [actionSheetYear, setActionSheetYear] = useState<{category: string, year: string} | null>(null);
    
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [addingYearTo, setAddingYearTo] = useState<string | null>(null);
    
    // Search state
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Form state
    const [newFolderName, setNewFolderName] = useState("");
    const [newFolderYear, setNewFolderYear] = useState(new Date().getFullYear().toString());

    // Accordion state
    const [expandedFolder, setExpandedFolder] = useState<string | null>(null);

    // Prevent body scroll when modals are open
    useEffect(() => {
        if (isModalOpen || addingYearTo) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isModalOpen, addingYearTo]);

    const handleAddFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim()) return;

        const newFolder: FolderItem = {
            id: Date.now().toString(),
            name: newFolderName.trim().toUpperCase(),
            year: newFolderYear.trim() || undefined,
        };

        setFolders([newFolder, ...folders]);
        setIsModalOpen(false);
        setNewFolderName("");
        setNewFolderYear(new Date().getFullYear().toString());
        // Automatically expand the newly created or updated folder
        setExpandedFolder(newFolder.name);
    };

    const handleAddYearOnly = (e: React.FormEvent) => {
        e.preventDefault();
        if (!addingYearTo || !newFolderYear.trim()) return;

        const newFolder: FolderItem = {
            id: Date.now().toString(),
            name: addingYearTo,
            year: newFolderYear.trim(),
        };

        setFolders([newFolder, ...folders]);
        setAddingYearTo(null);
        setNewFolderYear(new Date().getFullYear().toString());
        setExpandedFolder(addingYearTo);
    };

    const handleDeleteCategory = (categoryName: string) => {
        setFolders(prev => prev.filter(f => f.name !== categoryName));
        if (expandedFolder === categoryName) setExpandedFolder(null);
    };

    const handleDeleteYear = (categoryName: string, year: string) => {
        setFolders(prev => prev.filter(f => !(f.name === categoryName && f.year === year)));
    };

    const isKpi = type === "kpi";
    const themeColor = isKpi ? "primary" : "secondary";

    // Group folders by name
    const groupedFolders = useMemo(() => {
        const groups: Record<string, { id: string, name: string, years: string[] }> = {};
        
        folders.forEach(f => {
            if (!groups[f.name]) {
                groups[f.name] = { id: f.name, name: f.name, years: [] };
            }
            if (f.year && !groups[f.name].years.includes(f.year)) {
                groups[f.name].years.push(f.year);
            }
        });
        
        // Filter by search query
        const query = searchQuery.toLowerCase();
        const filtered = Object.values(groups).filter(g => 
            g.name.toLowerCase().includes(query) || 
            g.years.some(y => y.includes(query))
        );

        // Sort years descending
        filtered.forEach(g => g.years.sort((a, b) => Number(b) - Number(a)));
        
        return filtered;
    }, [folders, searchQuery]);

    const handleFolderClick = (folderName: string) => {
        setExpandedFolder(prev => prev === folderName ? null : folderName);
    };

    return (
        <div className="flex flex-col min-h-[100dvh] bg-surface pb-24">
            {/* Header */}
            <header className={`sticky top-0 z-20 pt-12 pb-4 px-5 flex items-center shadow-md transition-colors duration-300 ${isKpi ? 'bg-primary' : 'bg-secondary'} text-white`}>
                {isSearchActive ? (
                    <div className="flex w-full items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
                        <button 
                            onClick={() => { setIsSearchActive(false); setSearchQuery(""); }} 
                            className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <input 
                            autoFocus
                            type="text" 
                            placeholder="Cari folder atau tahun..." 
                            className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/70 text-[17px] font-sans"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="p-2 rounded-full hover:bg-white/10 transition-colors">
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
                                <h1 className="font-display text-xl font-bold tracking-tight">
                                    {title}
                                </h1>
                                <p className="text-[13px] font-sans opacity-90">
                                    {groupedFolders.length} Kategori Tersedia
                                </p>
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
                {/* Folder List Layout */}
                <div className="flex flex-col gap-4">
                    {groupedFolders.length === 0 ? (
                        <div className="text-center py-10 opacity-50">
                            <Folder size={48} className="mx-auto mb-4 opacity-50" />
                            <p>Folder tidak ditemukan.</p>
                        </div>
                    ) : (
                        groupedFolders.map((group) => {
                            const isExpanded = expandedFolder === group.name;
                            
                            return (
                                <div 
                                    key={group.id}
                                    className={`bg-surface-container-lowest border rounded-[20px] overflow-hidden shadow-sm transition-all duration-300 ${isExpanded ? 'border-primary/30 shadow-md ring-2 ring-primary/10' : 'border-surface-dim hover:border-primary/20 hover:shadow-md'}`}
                                >
                                    {/* Main Folder Header */}
                                    <FolderHeader 
                                        group={group} 
                                        isKpi={isKpi} 
                                        isExpanded={isExpanded} 
                                        onClick={() => handleFolderClick(group.name)} 
                                        onLongPress={() => setActionSheetFolder({ name: group.name })}
                                    />

                                    {/* Expanded Content (Years) */}
                                    <div 
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                                    >
                                        <div className="p-4 pt-0 border-t border-surface-dim/50 mt-2">
                                            <p className="text-xs font-bold text-on-surface-variant mb-3 uppercase tracking-wider">
                                                Pilih Tahun
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {group.years.map(year => (
                                                    <YearChip
                                                        key={year}
                                                        year={year}
                                                        isKpi={isKpi}
                                                        onClick={() => router.push(`/folder?category=${encodeURIComponent(group.name)}&year=${year}&type=${type}`)}
                                                        onLongPress={() => setActionSheetYear({ category: group.name, year })}
                                                    />
                                                ))}
                                                
                                                {/* Add Year Shortcut Chip */}
                                                <div 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setAddingYearTo(group.name);
                                                    }}
                                                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl cursor-pointer transition-all active:scale-95 border-2 border-dashed border-surface-dim hover:border-primary/50 text-on-surface-variant hover:text-primary bg-surface-container/30 hover:bg-primary/5"
                                                >
                                                    <Plus size={16} />
                                                    <span className="font-bold text-sm">Tambah</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </main>

            {/* Floating Action Button (Extended FAB) */}
            <div className="fixed bottom-24 right-0 left-0 max-w-md mx-auto w-full pointer-events-none flex justify-end px-5 z-40">
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className={`pointer-events-auto h-14 px-5 rounded-full flex items-center gap-2 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.3)] transition-all active:scale-[0.97] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.4)] ${
                        isKpi 
                            ? "bg-primary text-white" 
                            : "bg-secondary text-white"
                    }`}
                >
                    <Plus size={24} />
                    <span className="font-bold text-[15px] font-sans pr-1">Buat Kategori</span>
                </button>
            </div>

            {/* Modal Overlay: Buat Kategori Baru */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setIsModalOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300">
                        <div className="px-6 pt-6 pb-4 border-b border-surface-dim flex justify-between items-center">
                            <h2 className="font-display text-2xl font-bold text-on-surface">Buat Kategori Baru</h2>
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
                            >
                                <X size={20} className="text-on-surface-variant" />
                            </button>
                        </div>

                        <form onSubmit={handleAddFolder} className="p-6 flex flex-col gap-5">
                            <Input
                                label="Nama Kategori"
                                type="text"
                                placeholder="Contoh: VIDEO EDUKASI"
                                icon={<Folder size={20} />}
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                autoFocus
                                required
                            />
                            <Input
                                label="Tahun"
                                type="number"
                                placeholder="Contoh: 2026"
                                icon={<Calendar size={20} />}
                                value={newFolderYear}
                                onChange={(e) => setNewFolderYear(e.target.value)}
                            />

                            <div className="mt-4">
                                <Button type="submit" className={`w-full h-14 text-lg rounded-xl ${isKpi ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}>
                                    Simpan Kategori
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Overlay: Tambah Tahun */}
            {addingYearTo && (
                <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-5">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
                        onClick={() => setAddingYearTo(null)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300">
                        <div className="px-6 pt-6 pb-4 border-b border-surface-dim flex justify-between items-center">
                            <h2 className="font-display text-xl font-bold text-on-surface line-clamp-1 pr-4">
                                Tambah Tahun
                            </h2>
                            <button 
                                onClick={() => setAddingYearTo(null)}
                                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-high transition-colors"
                            >
                                <X size={20} className="text-on-surface-variant" />
                            </button>
                        </div>

                        <form onSubmit={handleAddYearOnly} className="p-6 flex flex-col gap-5">
                            <p className="text-sm text-on-surface-variant font-sans">
                                Menambahkan tahun baru untuk kategori:<br/>
                                <strong className="text-on-surface text-base">{addingYearTo}</strong>
                            </p>
                            
                            <Input
                                label="Tahun"
                                type="number"
                                placeholder="Contoh: 2027"
                                icon={<Calendar size={20} />}
                                value={newFolderYear}
                                onChange={(e) => setNewFolderYear(e.target.value)}
                                autoFocus
                                required
                            />

                            <div className="mt-4">
                                <Button type="submit" className={`w-full h-14 text-lg rounded-xl ${isKpi ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'}`}>
                                    Simpan Tahun
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Action Sheet: Folder Options */}
            {actionSheetFolder && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center p-0">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => setActionSheetFolder(null)}
                    ></div>
                    <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
                        <div className="w-12 h-1.5 bg-surface-dim rounded-full mx-auto mb-6"></div>
                        <h3 className="font-display font-bold text-xl text-on-surface mb-1 line-clamp-1">
                            {actionSheetFolder.name}
                        </h3>
                        <p className="text-sm font-sans text-on-surface-variant mb-6">
                            Pilih tindakan untuk kategori ini.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => {
                                    handleDeleteCategory(actionSheetFolder.name);
                                    setActionSheetFolder(null);
                                }}
                                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-500/20 active:bg-red-500/30 transition-colors font-bold text-[16px]"
                            >
                                <Trash2 size={20} />
                                Hapus Kategori
                            </button>
                            <button 
                                onClick={() => setActionSheetFolder(null)}
                                className="w-full p-4 rounded-2xl text-on-surface font-bold hover:bg-surface-container active:bg-surface-container-high transition-colors text-[16px]"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Action Sheet: Year Options */}
            {actionSheetYear && (
                <div className="fixed inset-0 z-[110] flex items-end justify-center p-0">
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" 
                        onClick={() => setActionSheetYear(null)}
                    ></div>
                    <div className="relative w-full max-w-md bg-surface-container-lowest rounded-t-[32px] p-6 pb-12 animate-in slide-in-from-bottom-full duration-300 shadow-2xl">
                        <div className="w-12 h-1.5 bg-surface-dim rounded-full mx-auto mb-6"></div>
                        <h3 className="font-display font-bold text-xl text-on-surface mb-1 line-clamp-1">
                            Tahun {actionSheetYear.year}
                        </h3>
                        <p className="text-sm font-sans text-on-surface-variant mb-6">
                            dari kategori {actionSheetYear.category}
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <button 
                                onClick={() => {
                                    handleDeleteYear(actionSheetYear.category, actionSheetYear.year);
                                    setActionSheetYear(null);
                                }}
                                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-500/10 text-red-600 hover:bg-red-500/20 active:bg-red-500/30 transition-colors font-bold text-[16px]"
                            >
                                <Trash2 size={20} />
                                Hapus Tahun
                            </button>
                            <button 
                                onClick={() => setActionSheetYear(null)}
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
