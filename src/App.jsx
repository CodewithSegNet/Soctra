import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import SignIn from "./layouts/SignInMobile";
import SignUp from "./layouts/SignUpMobile";
import SignUpDesktop from "./layouts/SignUpDesktop";
import SignInDesktop from "./layouts/SignInDesktop";
import DesktopOnboardingSteps from "./components/StepOneDesktop";
import MobileOnboardingSteps from "./components/StepOneMobile";

// Mobile Status Bar Component
const MobileStatusBar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-black text-white px-4 py-2 flex justify-between items-center text-sm font-medium">
      <div className="flex items-center space-x-1">
        <span>{formatTime(currentTime)}</span>
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Signal bars */}
        <div className="flex items-end space-x-[1px]">
          <div className="w-1 h-2 bg-white rounded-[0.5px]"></div>
          <div className="w-1 h-3 bg-white rounded-[0.5px]"></div>
          <div className="w-1 h-4 bg-white rounded-[0.5px]"></div>
          <div className="w-1 h-4 bg-white/40 rounded-[0.5px]"></div>
        </div>
        
        {/* WiFi icon */}
        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.07 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
        </svg>
        
        {/* Battery */}
        <div className="flex items-center ml-1">
          <div className="w-6 h-3 border border-white rounded-[1px] relative">
            <div className="absolute inset-[1px] bg-white rounded-[0.5px] w-4/5"></div>
          </div>
          <div className="w-[1px] h-2 bg-white rounded-r-[0.5px] ml-[1px]"></div>
        </div>
      </div>
    </div>
  );
};

// Mobile Layout Wrapper
const MobileWrapper = ({ children }) => {
  return (
    <div className="min-h-screen bg-black">
      <MobileStatusBar />
      <div className="pt-10"> {/* Add padding for status bar */}
        {children}
      </div>
    </div>
  );
};

// Responsive Route Component
const ResponsiveRoute = ({ mobileComponent: Mobile, desktopComponent: Desktop, ...props }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isDesktop) {
    return <Desktop {...props} />;
  }

  return (
    <MobileWrapper>
      <Mobile {...props} />
    </MobileWrapper>
  );
};

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize); 

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!hasOnboarded) {
    return <Onboarding onDone={() => setHasOnboarded(true)} />;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route 
          path="/" 
          element={
            <ResponsiveRoute 
              mobileComponent={MobileOnboardingSteps}
              desktopComponent={DesktopOnboardingSteps}
            />
          } 
        />
        <Route 
          path="/sign-in" 
          element={
            <ResponsiveRoute 
              mobileComponent={SignIn}
              desktopComponent={SignInDesktop}
            />
          } 
        />
        <Route 
          path="/sign-up" 
          element={
            <ResponsiveRoute 
              mobileComponent={SignUp}
              desktopComponent={SignUpDesktop}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;