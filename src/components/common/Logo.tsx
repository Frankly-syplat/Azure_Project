import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 32, className = '' }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        className="logo-bg-primary rounded-md"
      >
        <rect width="32" height="32" rx="6" className="logo-bg-primary"/>
        <text 
          x="16" 
          y="22" 
          fontSize="20" 
          textAnchor="middle" 
          className="fill-white font-bold"
          style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}
        >
          S
        </text>
      </svg>
    </div>
  );
};

export default Logo;