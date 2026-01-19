"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className = "", variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[#F5C745] text-gray-900 hover:bg-[#e0b230] focus:ring-[#F5C745] shadow-md",
      secondary:
        "bg-white text-[#2d2d2d] border border-gray-200 hover:bg-gray-50 focus:ring-gray-300 shadow-sm",
      danger:
        "bg-red-500 text-white hover:bg-red-600 focus:ring-red-400",
      ghost:
        "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-300",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
