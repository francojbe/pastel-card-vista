
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-2.5">
      <img 
        src="/logo.png" 
        alt="ClariFi Logo" 
        className="h-10 w-auto object-contain"
      />
    </div>
  );
};

export default Logo;
