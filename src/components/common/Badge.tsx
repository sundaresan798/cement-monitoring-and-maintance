import React from 'react';

export type BadgeVariant = 
  | 'success' // Emerald / Green for RUNNING, OPERATIONAL, AVAILABLE
  | 'warning' // Amber for WARNING, LOW STOCK, MAINTENANCE DUE
  | 'danger'  // Rose / Red for STOPPED, CRITICAL, UNDER MAINTENANCE, HIGH PRIORITY
  | 'info'    // Cyan / Slate for informational states
  | 'neutral';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  pulse = false
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    success: {
      container: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
      dot: 'bg-emerald-400'
    },
    warning: {
      container: 'bg-amber-950/70 text-amber-300 border-amber-800/60',
      dot: 'bg-amber-400'
    },
    danger: {
      container: 'bg-rose-950/70 text-rose-300 border-rose-800/60',
      dot: 'bg-rose-400'
    },
    info: {
      container: 'bg-cyan-950/70 text-cyan-300 border-cyan-800/60',
      dot: 'bg-cyan-400'
    },
    neutral: {
      container: 'bg-slate-800 text-slate-300 border-slate-700',
      dot: 'bg-slate-400'
    }
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide'
  };

  const currentVariant = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border ${sizeStyles[size]} ${currentVariant.container}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentVariant.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${currentVariant.dot}`} />
      </span>
      <span>{children}</span>
    </span>
  );
};
