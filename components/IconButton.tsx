
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  title?: string;
}

const IconButton: React.FC<IconButtonProps> = ({ onClick, children, className = '', ariaLabel, title }) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      title={title || ariaLabel}
      className={`p-2 rounded-full hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 transition-colors duration-150 ${className}`}
    >
      {children}
    </button>
  );
};

export default IconButton;
