import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./components/Onboarding";
import HomePage from "./layouts/Homepage";
import DesktopOnboardingSteps from "./components/StepOneDesktop";
import MobileOnboardingSteps from "./components/StepOneMobile";

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
        <Route path="/" element={isDesktop ? <DesktopOnboardingSteps /> : <MobileOnboardingSteps />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
