import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Warning from "../assets/warning.png";
import GoogleIcon from "../assets/google.png";
import AppleIcon from "../assets/apple.png"; 
import { useNavigate } from 'react-router-dom';
// import { FiArrowLeft } from "react-icons/fi";

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
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0); // Track password strength

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
    
    // Check if password meets all criteria
    const strength = [
      password.length >= minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSpecialChar
    ].filter(Boolean).length;
    
    setPasswordStrength(strength); // Set password strength
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
      const res = await fetch(`${apiUrl}/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to sign up");

      const result = await res.json();
      console.log("Success:", result);
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
    <section className="bg-black text-white min-h-screen flex flex-col pt-[5rem] px-6">
      <div className="mb-10">
        <div className="flex justify-end items-center w-full mb-6">
          {step === 2 && (
            <button
              onClick={() => setStep(1)}
              className="text-white cursor-pointer font-normal flex items-center"
            >
              {/* <FiArrowLeft className="mr-2" /> */}
            </button>
          )}
          <p
            onClick={handleSkip}
            className="text-white cursor-pointer font-normal"
          >
            Skip
          </p>
        </div>

        <h3 className="text-[32px] leading-[40px] font-bold mb-[16px]">
          {step === 1 ? "Get Started with Soctral" : "Verify Your Phone Number"}
        </h3>
        <p className="text-base text-gray-300">
          {step === 1
            ? "Create an Account to Buy and Sell Social Media Accounts Securely."
            : "Enter your phone number to receive a verification code."}
        </p>
      </div>

      {step === 1 ? (
        <motion.form
          className="space-y-5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmitStep1}
        >
          <div className="space-y-1">
            <label className="block text-xl mb-[11px] font-medium">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email address"
              className="w-full py-5 rounded-[90px] pl-5 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white"
            />
          </div>

          {error && (
            <div className="flex items-center space-x-3">
              <img src={Warning} alt="Warning" className="w-6 h-6" />
              <p className="text-red-500 text-xl my-[2px] text-left">{error}</p>
            </div>
          )}

          <div className="flex text-center flex-col text-xl py-3">
            <p>Or With</p>
          </div>
          <div className="flex justify-center space-x-8 mb-8">
            <button
              type="button"
              onClick={() => console.log("Sign up with Google")}
              className="text-white"
            >
              <img src={GoogleIcon} alt="Google" className="w-8 h-8" />
            </button>
            <button
              type="button"
              onClick={() => console.log("Sign up with Apple")}
              className="text-white"
            >
              <img src={AppleIcon} alt="Apple" className="w-8 h-8" />
            </button>
          </div>

          <div className="flex items-start space-x-2 my-4">
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
              className="accent-primary mt-1"
            />
            <label htmlFor="termsAccepted" className="text-sm text-gray-400">
              I have read and agree to Soctral's{" "}
              <span className="text-white underline">Terms of Service</span>
            </label>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              type="submit"
              disabled={loading || !formData.termsAccepted}
              className={`w-full p-5 rounded-[90px] bg-primary text-white font-semibold transition-opacity ${
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
              className="w-full p-5 rounded-[90px] border border-primary bg-black text-white font-semibold"
            >
              Sign In
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.form
          className="space-y-5"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmitStep2}
        >
          <div className="space-y-2">
            <label className="block text-xl mb-[16px] font-medium">
              Phone Number
            </label>
            <div className="flex items-center border border-gray-400 rounded-[90px] bg-black overflow-hidden">
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleInputChange}
                className="bg-black text-white pl-4 pr-2 py-5 outline-none appearance-none"
              >
                <option value="+234">🇳🇬 (+234)</option>
                <option value="+1">🇺🇸 (+1)</option>
                <option value="+44">🇬🇧 (+44)</option>
                <option value="+91">🇮🇳 (+91)</option>
                <option value="+27">🇿🇦 (+27)</option>
              </select>
              <div className="h-8 w-px bg-white/30 mx-3" />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="flex-1 bg-black text-white placeholder-gray-400 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full p-5 rounded-[90px] bg-primary text-white font-semibold transition-opacity ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Verifying..." : "Continue"}
          </button>
        </motion.form>
      )}
    </section>
  );
};

export default SignUp;
