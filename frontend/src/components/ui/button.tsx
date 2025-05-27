import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "icon";
  isLoading?: boolean;
}

export function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className="mr-2">Loading...</span> : children}
    </button>
  );
}
