import React from 'react';

// Scalable notebook icon that inherits text color via currentColor
const NotebookIcon = ({ size = '1em', className = '' }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="10" y="6" width="42" height="52" rx="6" fill="currentColor" opacity="0.18" />
    <rect x="14" y="10" width="34" height="44" rx="4" fill="#ffffff" stroke="currentColor" strokeWidth="3" />
    <rect x="8" y="6" width="6" height="52" rx="2" fill="currentColor" />
    <circle cx="11" cy="18" r="1.8" fill="#ffffff" />
    <circle cx="11" cy="32" r="1.8" fill="#ffffff" />
    <circle cx="11" cy="46" r="1.8" fill="#ffffff" />
    <g stroke="#94c5ff" strokeWidth="2" strokeLinecap="round">
      <line x1="20" y1="22" x2="42" y2="22" />
      <line x1="20" y1="30" x2="38" y2="30" />
      <line x1="20" y1="38" x2="40" y2="38" />
      <line x1="20" y1="46" x2="36" y2="46" />
    </g>
  </svg>
);

export default NotebookIcon;
