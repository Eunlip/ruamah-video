"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IdCard, Lock, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginAPI } from "@/services/api";

export function LoginForm() {
    const [nrp, setNrp] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Cegah klik ganda jika sedang loading
        if (isLoading) return;

        setErrorMsg("");
        setIsLoading(true);

        try {
            const result = await loginAPI(nrp, password);

            if (result.success) {
                // Simpan data user ke localStorage
                localStorage.setItem("user", JSON.stringify(result.user));
                router.push("/home");
            } else {
                setErrorMsg(result.error || "Login gagal.");
            }
        } catch (error) {
            setErrorMsg("Terjadi kesalahan jaringan.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
            {errorMsg && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-in fade-in zoom-in-95 duration-300">
                    {errorMsg}
                </div>
            )}
            <Input
                label="NRP"
                type="text"
                inputMode="numeric"
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="username"
                placeholder="Enter your NRP"
                icon={<IdCard size={20} />}
                value={nrp}
                onChange={(e) => setNrp(e.target.value)}
                disabled={isLoading}
                required
            />
            <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                icon={<Lock size={20} />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
            />

            <div className="pt-2">
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} />
                            Memproses...
                        </div>
                    ) : (
                        "Masuk"
                    )}
                </Button>
            </div>
        </form>
    );
}
