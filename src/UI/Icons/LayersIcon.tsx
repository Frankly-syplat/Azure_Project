import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
}

export const LayersIcon: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="12,2 2,7 12,12 22,7 12,2" />
    <polyline points="2,17 12,22 22,17" />
    <polyline points="2,12 12,17 22,12" />
  </svg>
);
