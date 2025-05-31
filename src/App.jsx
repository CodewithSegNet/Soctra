import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import SignInMobile from "./layouts/SignInMobile";
import SignUpMobile from "./layouts/SignUpMobile";
import SignUpDesktop from "./layouts/SignUpDesktop";
import SignInDesktop from "./layouts/SignInDesktop";
import DesktopOnboardingSteps from "./components/StepOneDesktop";
import MobileOnboardingSteps from "./components/StepOneMobile";

// Custom hook for responsive detection
const useResponsive = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  return { isDesktop, isMobile: !isDesktop };
};

// Responsive wrapper component
const ResponsiveComponent = ({ MobileComponent, DesktopComponent, ...props }) => {
  const { isDesktop } = useResponsive();
  
  return isDesktop ? 
    <DesktopComponent {...props} /> : 
    <MobileComponent {...props} />;
};

function App() {
  const [hasOnboarded, setHasOnboarded] = useState(false);
const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001";

  if (!hasOnboarded) {
    return <Onboarding onDone={() => setHasOnboarded(true)} />;
  }

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route 
          path="/" 
          element={
            <ResponsiveComponent 
              MobileComponent={MobileOnboardingSteps}
              DesktopComponent={DesktopOnboardingSteps}
            />
          } 
        />
        <Route 
          path="/sign-in" 
          element={
            <ResponsiveComponent 
              MobileComponent={SignInMobile}
              DesktopComponent={SignInDesktop}
              apiUrl={apiUrl}
            />
          } 
        />
        <Route 
          path="/sign-up" 
          element={
            <ResponsiveComponent 
              MobileComponent={SignUpMobile}
              DesktopComponent={SignUpDesktop}
              apiUrl={apiUrl}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;