import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import SignInMobile from "./layouts/SignInMobile";
import SignUpMobile from "./layouts/SignUpMobile";
import SignUpDesktop from "./layouts/SignUpDesktop";
import SignInDesktop from "./layouts/SignInDesktop";
import MobileHomepage from "./layouts/mobilehomepage"
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

  // Ensure status bar is black for all screens after onboarding
  useEffect(() => {
    if (hasOnboarded) {
      const setStatusBarColor = (color, style = 'default') => {
        // For iOS Safari
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (!metaThemeColor) {
          metaThemeColor = document.createElement('meta');
          metaThemeColor.name = 'theme-color';
          document.head.appendChild(metaThemeColor);
        }
        metaThemeColor.content = color;

        // For iOS Safari status bar style
        let metaStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
        if (!metaStatusBar) {
          metaStatusBar = document.createElement('meta');
          metaStatusBar.name = 'apple-mobile-web-app-status-bar-style';
          document.head.appendChild(metaStatusBar);
        }
        metaStatusBar.content = style;

        // For Android Chrome
        let metaAndroid = document.querySelector('meta[name="msapplication-navbutton-color"]');
        if (!metaAndroid) {
          metaAndroid = document.createElement('meta');
          metaAndroid.name = 'msapplication-navbutton-color';
          document.head.appendChild(metaAndroid);
        }
        metaAndroid.content = color;
      };

      // Set black status bar for all screens after onboarding
      setStatusBarColor('#000000', 'default');
    }
  }, [hasOnboarded]);

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



              <Route 
          path="/mobilehomepage" 
          element={
            <ResponsiveComponent 
              MobileComponent={MobileHomepage}
              DesktopComponent={DesktopOnboardingSteps}
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;