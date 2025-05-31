import { useState, useEffect } from 'react';

export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState({
    isMobile: window.innerWidth < 768,
    isTablet: window.innerWidth >= 768 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDeviceType({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
        height
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

// components/MobileEnhancers.jsx

// Mobile App Feel Enhancer
export const MobileAppEnhancer = ({ children }) => {
  useEffect(() => {
    // Prevent zoom on double tap
    let lastTouchEnd = 0;
    const handleTouchEnd = (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };
    
    // Prevent context menu on long press
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Add mobile-specific styles
    const addMobileStyles = () => {
      const style = document.createElement('style');
      style.innerHTML = `
        @media (max-width: 767px) {
          body {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -webkit-tap-highlight-color: transparent;
            overscroll-behavior: none;
            position: fixed;
            width: 100%;
            height: 100vh;
            overflow: hidden;
          }
          
          #root {
            width: 100%;
            height: 100vh;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
          }
          
          /* Custom scrollbar for mobile */
          ::-webkit-scrollbar {
            width: 2px;
          }
          
          ::-webkit-scrollbar-track {
            background: transparent;
          }
          
          ::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 1px;
          }
          
          /* Smooth animations */
          * {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
          
          /* Native-like transitions */
          .mobile-transition {
            transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
          }
          
          /* Native-like buttons */
          .mobile-button:active {
            transform: scale(0.95);
            opacity: 0.8;
          }
        }
      `;
      document.head.appendChild(style);
    };

    if (window.innerWidth < 768) {
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('contextmenu', handleContextMenu, false);
      addMobileStyles();
    }

    return () => {
      document.removeEventListener('touchend', handleTouchEnd, false);
      document.removeEventListener('contextmenu', handleContextMenu, false);
    };
  }, []);

  return children;
};

// Mobile Safe Area Component
export const MobileSafeArea = ({ children, className = "" }) => {
  return (
    <div 
      className={`min-h-screen bg-black ${className}`}
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        paddingLeft: 'env(safe-area-inset-left)',  
        paddingRight: 'env(safe-area-inset-right)'
      }}
    >
      {children}
    </div>
  );
};

// Mobile Navigation Bar Component
export const MobileNavBar = ({ title, onBack, rightAction }) => {
  return (
    <div className="sticky top-0 z-40 bg-black border-b border-gray-800 px-4 py-3 flex items-center justify-between">
      {onBack && (
        <button 
          onClick={onBack}
          className="flex items-center text-white hover:text-gray-300 mobile-button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <h1 className="text-white font-medium text-lg flex-1 text-center">
        {title}
      </h1>
      
      <div className="w-6">
        {rightAction}
      </div>
    </div>
  );
};

// Haptic Feedback Hook (simulated)
export const useHapticFeedback = () => {
  const triggerHaptic = (type = 'light') => {
    if (navigator.vibrate) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        error: [20, 100, 20]
      };
      navigator.vibrate(patterns[type] || patterns.light);
    }
  };

  return { triggerHaptic };
};

// Mobile Keyboard Spacer (handles virtual keyboard)
export const MobileKeyboardSpacer = () => {
  useEffect(() => {
    const handleViewportChange = () => {
      const viewport = window.visualViewport;
      if (viewport) {
        const offsetBottom = viewport.height - window.innerHeight;
        document.documentElement.style.setProperty(
          '--keyboard-height',
          `${Math.max(0, -offsetBottom)}px`
        );
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      return () => {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      };
    }
  }, []);

  return (
    <div 
      className="transition-all duration-300"
      style={{ height: 'var(--keyboard-height, 0px)' }}
    />
  );
};