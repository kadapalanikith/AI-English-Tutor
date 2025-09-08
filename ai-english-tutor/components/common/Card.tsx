
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl p-5 border border-slate-200 shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export default Card;
