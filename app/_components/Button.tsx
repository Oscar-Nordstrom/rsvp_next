import { ButtonHTMLAttributes, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "rounded-full font-medium bg-foreground text-background hover:bg-primary-hover",
  secondary:
    "rounded-full font-medium border border-solid border-border hover:border-transparent hover:bg-surface-hover",
  danger:
    "rounded-full font-medium border border-solid border-danger-border text-danger hover:bg-surface-hover",
  ghost: "text-subtle underline underline-offset-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-5 py-2.5 text-sm",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "primary", size = "md", className = "", ...props },
  ref,
) {
  const classes = [
    "transition-colors",
    variantClasses[variant],
    variant === "ghost" ? "text-sm" : sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return <button ref={ref} className={classes} {...props} />;
});

export default Button;
