import { forwardRef } from "react";

interface SharedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "filled" | "outline" | "light" | "subtle" | "default";
  color?: string;
  rounded?: boolean;
}

export const SharedButton = forwardRef<HTMLButtonElement, SharedButtonProps>(
  (
    {
      variant = "filled",
      color = "#FF0A00",
      children,
      className,
      rounded = false,
      type = "button",
      style,
      ...props
    },
    ref
  ) => {
    const baseStyles: React.CSSProperties = {
      padding: "8px 24px", // px-6 py-2
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
      cursor: "pointer",
      borderRadius: rounded ? "9999px" : "8px",
      border: "none",
      fontWeight: 600,
      fontSize: "1rem",
      color: variant === "filled" ? "#fff" : color,
      backgroundColor: variant === "filled" ? color : "transparent",
      ...(variant === "outline" && {
        border: `2px solid ${color}`,
        color: color,
        backgroundColor: "transparent",
      }),
      ...(variant === "light" && {
        backgroundColor: `${color}22`, // light transparent bg
        color: color,
      }),
      ...(variant === "subtle" && {
        backgroundColor: "transparent",
        color: color,
      }),
      ...(variant === "default" && {
        backgroundColor: "#e0e0e0",
        color: "#333",
      }),
    };

    return (
      <button
        type={type}
        className={className}
        ref={ref}
        style={{
          ...baseStyles,
          ...style,
        }}
        onMouseEnter={(e) => {
          if (variant === "filled") {
            e.currentTarget.style.boxShadow = `0 6px 15px ${color}`;
          }
        }}
        onMouseLeave={(e) => {
          if (variant === "filled") {
            e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
          }
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

SharedButton.displayName = "SharedButton";
