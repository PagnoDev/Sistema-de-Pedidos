// src/components/ui/button.tsx
import { ButtonHTMLAttributes, FC } from "react";
import clsx from "clsx";

type Variant = "default" | "outline";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export const Button: FC<ButtonProps> = ({ variant = "default", className, ...props }) => {
  const base = "px-4 py-2 rounded font-semibold transition";
  const styles = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-blue-600 text-blue-600 hover:bg-blue-100",
  };

  return (
    <button
      {...props}
      className={clsx(base, styles[variant], className)}
    />
  );
};
