import * as React from "react";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className ?? ""}`}>
    {children}
  </div>
);

export const CardContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={className ?? "p-4"}>{children}</div>;
