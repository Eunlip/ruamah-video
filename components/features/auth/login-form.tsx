"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IdCard, Lock, ArrowRight } from "lucide-react";

export function LoginForm() {
    const [nrp, setNrp] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login attempt:", { nrp, password });
        // TODO: Implement actual login
    };

    return (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
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
                required
            />

            <div className="pt-2">
                <Button type="submit">
                    Sign In <ArrowRight size={20} />
                </Button>
            </div>
        </form>
    );
}
