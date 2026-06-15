import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  label: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    return (
      <div className="w-full flex flex-col gap-2">
        <label className="text-sm font-semibold text-on-surface-variant font-sans">
          {label}
        </label>
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-4 text-on-surface-variant opacity-70">
              {icon}
            </div>
          )}
          <input
            type={isPassword && showPassword ? "text" : type}
            className={`w-full bg-surface-container-low border-2 border-transparent focus:border-primary focus:bg-white transition-colors duration-200 rounded-xl h-14 text-on-surface placeholder:text-on-surface-variant/40 outline-none ${
              icon ? "pl-12" : "pl-4"
            } ${isPassword ? "pr-12" : "pr-4"} ${className || ""}`}
            ref={ref}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-on-surface-variant opacity-70 hover:opacity-100 transition-opacity"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";
