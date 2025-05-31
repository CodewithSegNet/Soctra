import React from 'react';
import { useScreenSize } from '../hooks/useDevicestype';

const PageLayout = ({ children, mobileLayout = true, desktopLayout = true }) => {
  const { isMobile } = useScreenSize();

  if (isMobile && mobileLayout) {
    return (
      <section className="bg-black text-white h-screen flex flex-col">
        <div className="flex flex-col h-full overflow-auto px-4 py-4">
          {children}
        </div>
      </section>
    );
  }

  if (!isMobile && desktopLayout) {
    return (
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 flex justify-center items-center px-4">
        <section className="bg-[rgba(13,13,13,1)] w-[502px] rounded-[20px]">
          <div className="relative z-10 w-full bg-[#0F0F0F] rounded-2xl shadow-lg p-6">
            {children}
          </div>
        </section>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default PageLayout;