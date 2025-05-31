import { useEffect, useState } from "react";
import logo from "../assets/soctraLogo.png";

export default function Onboarding({ onDone }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Set status bar color for mobile onboarding
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

    // Set purple status bar when onboarding starts
    setStatusBarColor('rgba(96, 60, 208, 1)', 'default');

    const timer = setTimeout(() => {
      setShow(false);
      // Reset status bar color when onboarding ends
      setStatusBarColor('#ffffff', 'default'); // or whatever your default color is
      onDone();
    }, 3000);

    return () => {
      clearTimeout(timer);
      // Cleanup: reset status bar color if component unmounts
      setStatusBarColor('#ffffff', 'default');
    };
  }, [onDone]);

  if (!show) return null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-onboarding-gradient bg-cover text-center text-white">
      <img src={logo} alt="Company Logo" className="w-32 h-32" />
      <div className="absolute bottom-8 text-white text-2xl font-bold">
        Soctral
      </div>
    </div>
  );
}