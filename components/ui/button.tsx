import React, { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", ...props }, ref) => {
    const baseStyles = "w-full h-14 rounded-xl font-bold transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98]";
    
    const variants = {
      primary: "bg-gradient-to-br from-primary to-secondary text-white shadow-[0_8px_24px_-8px_rgba(93,92,255,0.4)] hover:shadow-[0_12px_28px_-8px_rgba(93,92,255,0.6)]",
      secondary: "border-2 border-primary text-primary hover:bg-primary/5",
      ghost: "text-primary hover:bg-primary/5",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className || ""}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
