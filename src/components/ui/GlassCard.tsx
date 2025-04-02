
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-white bg-opacity-80 backdrop-blur-sm border border-gray-200 shadow-md p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
