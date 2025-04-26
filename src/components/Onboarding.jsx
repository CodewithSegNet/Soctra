import { useEffect, useState } from "react";
import logo from "../assets/soctraLogo.png";

export default function Onboarding({ onDone }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onDone();
    }, 3000);

    return () => clearTimeout(timer);
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
