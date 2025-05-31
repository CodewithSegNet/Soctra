import React from 'react';

const MobileLayout = ({ children, className = "", style = {} }) => {
  return (
    <div 
      className={`
        min-h-screen min-h-[100dvh] w-full
        flex flex-col
        bg-black text-white
        overflow-x-hidden
        ${className}
      `}
      style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        width: '100vw',
        position: 'relative',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default MobileLayout;