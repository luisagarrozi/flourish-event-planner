import * as React from "react";

type Props = {
  size?: number;
  showText?: boolean;
  className?: string;
};

export function BrandLogo({ size = 40, showText = true, className }: Props) {
  return (
    <div className={className} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Assessoria Diamante"
      >
        <g fill={`hsl(var(--brand))`}>
          {/* Diamond star shape */}
          <path d="M50 5 C48 28 35 40 12 42 C35 44 48 56 50 95 C52 56 65 44 88 42 C65 40 52 28 50 5 Z" />
        </g>
      </svg>
             {showText && (
         <div style={{ lineHeight: 1 }}>
           <div style={{ fontFamily: 'Dancing Script, cursive', letterSpacing: '0.02em', fontWeight: '500' }} className="text-brand text-lg">Assessoria</div>
           <div style={{ fontFamily: 'Dancing Script, cursive', letterSpacing: '0.02em', fontWeight: '500' }} className="text-brand text-xl">Diamante</div>
         </div>
       )}
    </div>
  );
}

export default BrandLogo;

