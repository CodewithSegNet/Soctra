import React from 'react';
import { useScreenSize } from '../hooks/useScreenSize';

const ResponsiveWrapper = ({ 
  mobileComponent: MobileComponent, 
  desktopComponent: DesktopComponent,
  tabletComponent: TabletComponent = null,
  ...props 
}) => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  // Full screen mobile styles (covers status bar)
  const mobileStyles = {
    minHeight: '100vh',
    minHeight: '100dvh', // Dynamic viewport height for mobile
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  };

  if (isMobile) {
    return (
      <div style={mobileStyles} className="mobile-container">
        <MobileComponent {...props} />
      </div>
    );
  }

  if (isTablet && TabletComponent) {
    return <TabletComponent {...props} />;
  }

  if (isDesktop) {
    return <DesktopComponent {...props} />;
  }

  // Fallback to desktop component
  return <DesktopComponent {...props} />;
};

export default ResponsiveWrapper;