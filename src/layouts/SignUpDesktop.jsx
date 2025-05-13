import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Warning from "../assets/warning.png";
import GoogleIcon from "../assets/google.png";
import AppleIcon from "../assets/apple.png";

const SignUp = ({ apiUrl }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    countryCode: "+234",
    termsAccepted: false,
    otp: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      phone_number: formData.phoneNumber,
      country_code: formData.countryCode,
      password: formData.password,
    };
    try {
      const res = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to sign up");
      await res.json();
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep3 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: formData.otp }),
      });
      if (!res.ok) throw new Error("Failed to verify OTP");
      await res.json();
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStep4 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        }),
      });
      if (!res.ok) throw new Error("Failed to set password");
      await res.json();
      navigate("/homepage");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => navigate("/");
  const handleSignIn = () => navigate("/sign-in");

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <motion.form
            className="space-y-5"
            onSubmit={handleSubmitStep1}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="space-y-2">
              <label className="block text-basef font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="w-full p-4 rounded-full border border-gray-400 bg-black text-white placeholder-gray-400 focus:border-white outline-none"
              />
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500">
                <img src={Warning} alt="Warning" className="w-5 h-5" />
                <p>{error}</p>
              </div>
            )}

            <div className="text-center text-sm">Or Sign up with</div>
            <div className="flex justify-center gap-6">
              <button type="button" className="text-white">
                <img src={GoogleIcon} alt="Google" className="w-8 h-8" />
              </button>
              <button type="button" className="text-white">
                <img src={AppleIcon} alt="Apple" className="w-8 h-8" />
              </button>
            </div>
<div className="flex items-start gap-2">
  <input
    type="checkbox"
    name="termsAccepted"
    checked={formData.termsAccepted}
    onChange={(e) =>
      setFormData((prev) => ({
        ...prev,
        termsAccepted: e.target.checked,
      }))
    }
    className="accent-primary border-2 border-primary rounded"
  />


              <label className="text-xs text-gray-400">
               <span>I have read and agree to Soctrals</span>{" "}
                <span className="text-white underline">Terms of Service & Privacy Policy</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !formData.termsAccepted}
              className="w-full py-3 rounded-full bg-primary hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>

            <button
              type="button"
              onClick={handleSignIn}
              className="w-full py-3 border border-primary rounded-full"
            >
              Sign In
            </button>
          </motion.form>
        );

      case 2:
        return (
          <form onSubmit={handleSubmitStep2} className="space-y-4">
            <label className="block text-base font-medium">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full p-4 rounded-full border border-gray-400 bg-black text-white placeholder-gray-400 focus:border-white outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary hover:opacity-90 transition"
            >
              {loading ? "Sending..." : "Continue"}
            </button>
          </form>
        );

      case 3:
        return (
          <form onSubmit={handleSubmitStep3} className="space-y-4">
            <label className="block text-base font-medium">OTP</label>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              className="w-full p-4 rounded-full border border-gray-400 bg-black text-white placeholder-gray-400 focus:border-white outline-none"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary hover:opacity-90 transition"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>
        );

      case 4:
        return (
          <form onSubmit={handleSubmitStep4} className="space-y-4">
            <label className="block text-base font-medium">Set Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-4 rounded-full border border-gray-400 bg-black text-white"
              placeholder="New password"
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="w-full p-4 rounded-full border border-gray-400 bg-black text-white"
              placeholder="Confirm password"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-full bg-primary hover:opacity-90 transition"
            >
              {loading ? "Setting..." : "Finish"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 flex justify-center items-center px-4">
      <div className="bg-[rgba(13,13,13,1)] w-[502px] text-white rounded-2xl shadow-2xl p-8 relative">
        <div className="absolute top-4 right-6 text-sm text-gray-400 cursor-pointer" onClick={handleSkip}>
          Skip
        </div>
        <h2 className="text-[16px] font-bold mb-2">
          {step === 1
            ? "Get Started with Soctral"
            : step === 2
            ? "Verify Your Phone Number"
            : step === 3
            ? "Enter OTP"
            : "Set Your Password"}
        </h2>
        <p className="text-xs text-gray-400 mb-6">
          {step === 1
            ? "Create an Account to Buy and Sell Social Media Accounts Securely."
            : step === 2
            ? "Enter your phone number to receive a verification code."
            : step === 3
            ? "Enter the OTP sent to your phone."
            : "Create a secure password for your account."}
        </p>

        {renderStepForm()}
      </div>
    </div>
  );
};

export default SignUp;
