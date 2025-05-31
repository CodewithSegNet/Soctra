import React from 'react';
import { useScreenSize } from '../hooks/useScreenSize';

const ResponsiveWrapper = ({ 
  mobile: MobileComponent, 
  desktop: DesktopComponent, 
  tablet: TabletComponent,
  ...sharedProps 
}) => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  if (isMobile && MobileComponent) {
    return <MobileComponent {...sharedProps} />;
  }
  
  if (isTablet && TabletComponent) {
    return <TabletComponent {...sharedProps} />;
  }
  
  if (isDesktop && DesktopComponent) {
    return <DesktopComponent {...sharedProps} />;
  }

  // Fallback to desktop if no mobile component provided
  return <DesktopComponent {...sharedProps} />;
};

export default ResponsiveWrapper;