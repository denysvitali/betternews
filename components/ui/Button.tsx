"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode, useState } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "action";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: never;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  target?: string;
  rel?: string;
}

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const sizeStyles = {
  sm: "px-2.5 py-1.5 text-sm gap-1.5",
  md: "px-3 py-2 text-sm gap-2",
  lg: "px-4 sm:px-6 py-3 text-sm sm:text-base gap-2",
};

const variantStyles = {
  primary: "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 shadow-sm hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  secondary: "bg-white text-neutral-700 ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:hover:bg-neutral-800 shadow-sm hover:shadow-md active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  ghost: "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
  action: "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
};

const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

export function Button({
  variant = "secondary",
  size = "md",
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = cn(
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150",
    "hover:-translate-y-0.5",
    sizeStyles[size],
    variantStyles[variant],
    disabled && disabledStyles,
    className
  );

  if ("href" in props && props.href) {
    const { href, target, rel, ...rest } = props;
    return (
      <Link href={href} target={target} rel={rel} className={baseStyles} {...rest}>
        {children}
      </Link>
    );
  }

  const { onClick, type = "button", ...buttonProps } = props as ButtonAsButton;
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseStyles}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

// Icon button variant for compact icon-only buttons
interface IconButtonProps extends Omit<ButtonAsButton, "size" | "children"> {
  icon: ReactNode;
  "aria-label": string;
}

export function IconButton({
  variant = "ghost",
  icon,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-lg p-2 transition-all duration-150",
        "hover:scale-110 active:scale-90",
        variantStyles[variant],
        props.disabled && disabledStyles,
        className,
        "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
