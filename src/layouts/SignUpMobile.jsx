import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import Warning from "../assets/warning.png";
import GoogleIcon from "../assets/google.png";
import AppleIcon from "../assets/apple.png";

const SignUp = ({ apiUrl }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState("phone");
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
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      evaluatePasswordStrength(value);
    }
  };

  const evaluatePasswordStrength = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const strength = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length;

    setPasswordStrength(strength);
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload =
      method === "phone"
        ? {
            phone_number: formData.phoneNumber,
            country_code: formData.countryCode,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };

    try {
      const res = await fetch(`${apiUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to sign up");

      const result = await res.json();
      console.log("Success:", result);
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

      const result = await res.json();
      console.log("OTP Verified:", result);
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

    const payload = {
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    };

    try {
      const res = await fetch(`${apiUrl}/set-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to set password");

      const result = await res.json();
      console.log("Password Set:", result);
      navigate("/homepage");

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

  return (
    <section className="bg-black text-white h-screen flex flex-col overflow-hidden">
      <div className="flex flex-col h-full px-4 py-4">
        {/* Header section - Fixed */}
        <div className="flex-shrink-0">
          <div className="flex justify-end items-center w-full pt-8 mb-4">
            <p
              onClick={handleSkip}
              className="text-white cursor-pointer font-normal text-sm"
            >
              Skip
            </p>
          </div>

          <h3 className="text-2xl font-bold mb-3">
            {step === 1 ? "Get Started with Soctral" :
             step === 2 ? "Verify Your Phone Number" :
             step === 3 ? "Enter OTP" : "Set Your Password"}
          </h3>
          <p className="text-sm text-gray-300 mb-4">
            {step === 1
              ? "Create an Account to Buy and Sell Social Media Accounts Securely."
              : step === 2
              ? "Enter your phone number to receive a verification code."
              : step === 3
              ? "Enter the OTP sent to your phone to verify your number."
              : "Create a password for your account."}
          </p>
        </div>

        {/* Dynamic form content - Flexible */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {step === 1 ? (
            <form className="flex flex-col h-full" onSubmit={handleSubmitStep1}>
              {/* Form fields - Flexible */}
              <div className="flex-1 space-y-4 overflow-auto">
                <div className="mb-4">
                  <label className="block text-base mb-1 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full py-5 rounded-full pl-4 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white"
                  />
                </div>

                {error && (
                  <div className="flex items-center mb-4">
                    <img src={Warning} alt="Warning" className="w-5 h-5" />
                    <p className="text-red-500 text-sm ml-2">{error}</p>
                  </div>
                )}

                <div className="text-center mb-6">
                  <p className="text-sm">Or With</p>
                </div>

                <div className="flex justify-center space-x-8 mb-6">
                  <button type="button" onClick={() => {}}>
                    <img src={GoogleIcon} alt="Google" className="w-8 h-8" />
                  </button>
                  <button type="button" onClick={() => {}}>
                    <img src={AppleIcon} alt="Apple" className="w-8 h-8" />
                  </button>
                </div>

                <div className="flex items-start space-x-2 mb-6">
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
                    className="mt-1"
                  />
                  <label className="text-xs text-gray-400">
                    I have read and agree to Soctral's{" "}
                    <span className="text-white underline">Terms of Service & Privacy Policy</span>
                  </label>
                </div>
              </div>

              {/* Bottom buttons - Fixed */}
              <div className="flex-shrink-0 space-y-3 mt-4">
                <button
                  type="submit"
                  disabled={loading || !formData.termsAccepted}
                  className={`w-full py-5 rounded-full bg-primary text-white font-semibold transition-opacity ${
                    loading || !formData.termsAccepted
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </button>
                <button
                  type="button"
                  onClick={handleSignIn}
                  className="w-full py-5 rounded-full border border-primary bg-black text-white font-semibold"
                >
                  Sign In
                </button>
              </div>
            </form>
          ) : step === 2 ? (
            <form className="flex flex-col h-full" onSubmit={handleSubmitStep2}>
              {/* Form content - Flexible */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-base mb-2 font-medium">
                    Phone Number
                  </label>
                  <div className="flex items-center border border-gray-400 rounded-full bg-black overflow-hidden">
                    <select
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleInputChange}
                      className="bg-black text-white pl-3 pr-2 py-2 outline-none appearance-none"
                    >
                      <option value="+234">🇳🇬 (+234)</option>
                      <option value="+1">🇺🇸 (+1)</option>
                      <option value="+44">🇬🇧 (+44)</option>
                      <option value="+91">🇮🇳 (+91)</option>
                      <option value="+27">🇿🇦 (+27)</option>
                    </select>
                    <div className="h-5 w-px bg-white/30 mx-2" />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone number"
                      className="flex-1 bg-black text-white placeholder-gray-400 outline-none py-5"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom button - Fixed */}
              <div className="flex-shrink-0 mt-auto">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-full bg-primary text-white font-semibold transition-opacity ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </div>
            </form>
          ) : step === 3 ? (
            <form className="flex flex-col h-full" onSubmit={handleSubmitStep3}>
              {/* Form content - Flexible */}
              <div className="flex-1">
                <div className="mb-4">
                  <label className="block text-base mb-2 font-medium">
                    OTP
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    placeholder="Enter the OTP sent to your phone"
                    className="w-full py-5 rounded-full pl-4 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Bottom button - Fixed */}
              <div className="flex-shrink-0 mt-auto">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-5 rounded-full bg-primary text-white font-semibold transition-opacity ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Verifying OTP..." : "Verify OTP"}
                </button>
              </div>
            </form>
          ) : (
            <form className="flex flex-col h-full" onSubmit={handleSubmitStep4}>
              {/* Form content - Flexible */}
              <div className="flex-1 space-y-4">
                <div className="mb-4 relative">
                  <label className="block text-base mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className="w-full py-5 rounded-full pl-4 pr-10 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ?
                        <EyeOff className="w-5 h-5 text-gray-400" /> :
                        <Eye className="w-5 h-5 text-gray-400" />
                      }
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-base mb-2 font-medium">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full py-5 rounded-full pl-4 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white"
                  />
                </div>
              </div>

              {/* Bottom button - Fixed */}
              <div className="flex-shrink-0 mt-auto">
                <button
                  type="submit"
                  disabled={loading || formData.password !== formData.confirmPassword}
                  className={`w-full py-5 rounded-full bg-primary text-white font-semibold transition-opacity ${
                    loading || formData.password !== formData.confirmPassword
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {loading ? "Setting Password..." : "Set Password"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignUp;