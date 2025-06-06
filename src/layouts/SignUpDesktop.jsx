import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
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
    displayName: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (step === 3 && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (step === 3 && countdown === 0) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  // Reset countdown when moving to step 3
  useEffect(() => {
    if (step === 3) {
      setCountdown(30);
      setCanResend(false);
    }
  }, [step]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      evaluatePasswordStrength(value);
    }
    setError(null); // Clear error when user starts typing
  };

  const evaluatePasswordStrength = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const requirements = [minLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar];   
    const strength = requirements.filter(Boolean).length;

    setPasswordStrength(strength);
  };

  // Function to mask phone number for OTP display
  const getMaskedPhoneNumber = () => {
    const fullNumber = formData.countryCode + formData.phoneNumber;
    if (fullNumber.length < 2) return fullNumber;
    const lastTwo = fullNumber.slice(-2);
    const masked = fullNumber.slice(0, -2).replace(/./g, 'x');
    return masked + lastTwo;
  };

  // Enhanced validation functions
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{10,11}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const isStep1Valid = () => {
    return isValidEmail(formData.email) && formData.termsAccepted;
  };

  const isStep2Valid = () => {
    return isValidPhoneNumber(formData.phoneNumber);
  };

  const isStep3Valid = () => {
    return formData.otp.length === 6 && /^\d{6}$/.test(formData.otp);
  };

  const isStep4Valid = () => {
    return formData.password.length >= 8 &&
           formData.confirmPassword.length >= 8 &&
           formData.password === formData.confirmPassword &&
           passwordStrength >= 5;
  };

  const isStep5Valid = () => {
    return formData.displayName.trim().length >= 2;
  };

  // OTP handling functions
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const otpArray = formData.otp.padEnd(6, ' ').split('');
    otpArray[index] = value;
    const newOtp = otpArray.join('').replace(/ /g, '');

    setFormData(prev => ({ ...prev, otp: newOtp }));

    if (value && index < 5) {
      const nextInput = document.querySelector(`input[data-index="${index + 1}"]`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && index > 0) {
      const prevInput = document.querySelector(`input[data-index="${index - 1}"]`);
      if (prevInput) prevInput.focus();
    }
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = () => {
    const requirements = [
      { met: formData.password.length >= 8, text: "Minimum Of 8 Characters" },
      { met: /[A-Z]/.test(formData.password), text: "At least One Uppercase" },
      { met: /[a-z]/.test(formData.password), text: "At least One Lowercase" },
      { met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password), text: "At least One Special Character" },
      { met: /[0-9]/.test(formData.password), text: "At least One Number" }
    ];

    if (!formData.password) return null;

    const percentage = (passwordStrength / 5) * 100;

    return (
      <div className="mt-2">
        <div className="w-full bg-black rounded-full h-2 mb-2 border-2 border-purple-600">     
          <div
            className={`h-1 rounded-full transition-all duration-300 ${
              passwordStrength < 2 ? "bg-red-500" :
              passwordStrength < 4 ? "bg-yellow-500" : "bg-green-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="space-y-1">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${req.met ? 'bg-green-500' : 'bg-gray-500'}`} />
              <p className={`text-xs ${req.met ? 'text-green-400' : 'text-gray-400'}`}>        
                {req.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handleSubmitStep1 = (e) => {
    e.preventDefault();
    if (!isStep1Valid()) {
      setError("Please enter a valid email and accept the terms");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1000);
  };

  const handleSubmitStep2 = async (e) => {
    e.preventDefault();
    if (!isStep2Valid()) {
      setError("Please enter a valid phone number");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1000);
  };

  const handleSubmitStep3 = async (e) => {
    e.preventDefault();
    if (!isStep3Valid()) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1000);
  };

  const handleSubmitStep4 = async (e) => {
    e.preventDefault();
    if (!isStep4Valid()) {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
      } else if (passwordStrength < 5) {
        setError("Please meet all password requirements");
      } else {
        setError("Please check your password requirements");
      }
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(5);
    }, 1000);
  };

  const handleSubmitStep5 = async (e) => {
    e.preventDefault();
    if (!isStep5Valid()) {
      setError("Display name must be at least 2 characters long");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/homepage");
    }, 1000);
  };

  const handleSkip = () => navigate("/");
  const handleSignIn = () => navigate("/sign-in");

  const handleResendOtp = () => {
    if (!canResend) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCountdown(30);
      setCanResend(false);
      console.log("OTP resent");
    }, 1000);
  };

  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError(null); // Clear any errors when going back
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return "Get Started with Soctral";
      case 2: return "Verify Your Phone Number";
      case 3: return "Enter OTP";
      case 4: return "Set Your Password";
      case 5: return "Enter Your Display Name";
      default: return "";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1: return "Create an Account to Buy and Sell Social Media Accounts Securely.";
      case 2: return "Enter your phone number to receive a verification code.";
      case 3: return `Enter The 6-Digit Code we Texted to +${getMaskedPhoneNumber()}`;
      case 4: return "Create a strong password for your account.";
      case 5: return "Enter a Display Name to Represent You on Soctral.";
      default: return "";
    }
  };

  const renderStepForm = () => {
    const stepVariants = {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
    };

    switch (step) {
      case 1:
        return (
          <motion.form
            key="step1"
            className="space-y-4"
            onSubmit={handleSubmitStep1}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-sm mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email address"
                className="w-full p-4 rounded-full border border-gray-400 bg-black text-white placeholder-gray-400 focus:border-white outline-none transition-colors"
              />
              {formData.email && !isValidEmail(formData.email) && (
                <p className="text-red-400 text-xs mt-1">Please enter a valid email</p>
              )}
            </div>

            {error && (
              <div className="flex items-center space-x-2 text-red-500">
                <img src={Warning} alt="Warning" className="w-5 h-5" />
                <p className="text-sm">{error}</p>
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
                className="mt-1 w-4 h-4 appearance-none border border-gray-400 rounded bg-black checked:border-purple-700 relative after:content-['✓'] after:text-white after:text-xs after:absolute after:top-0 after:left-0.5 after:opacity-0 checked:after:opacity-100 transition-all"
                style={{
                  accentColor: 'rgba(96, 60, 208, 1)',
                  backgroundColor: formData.termsAccepted ? 'rgba(96, 60, 208, 1)' : 'black'
                }}
              />
              <label className="text-xs text-gray-400">
                I have read and agree to Soctral's{" "}
                <span className="text-white underline">Terms of Service & Privacy Policy</span>
              </label>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading || !isStep1Valid()}
                className={`w-full py-3 rounded-full text-white font-semibold transition-all flex items-center justify-center ${
                  loading || !isStep1Valid() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
                style={{ backgroundColor: 'rgba(96, 60, 208, 1)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Signing Up...
                  </>
                ) : (
                  "Sign Up"
                )}
              </button>
              <button
                type="button"
                onClick={handleSignIn}
                className="w-full py-3 rounded-full bg-black text-white font-semibold transition-all hover:opacity-90"
                style={{ border: '1px solid rgba(96, 60, 208, 1)' }}
              >
                Sign In
              </button>
            </div>
          </motion.form>
        );

      case 2:
        return (
          <motion.form
            key="step2"
            onSubmit={handleSubmitStep2}
            className="space-y-4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-sm mb-2 font-medium">Phone Number</label>
              <div className="flex items-center border border-gray-400 rounded-full bg-black overflow-hidden focus-within:border-white transition-colors">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleInputChange}
                  className="bg-black text-white pl-3 pr-2 py-2 outline-none appearance-none text-sm"
                >
                  <option value="+234">🇳🇬 (+234)</option>
                  <option value="+1">🇺🇸 (+1)</option>
                  <option value="+44">🇬🇧 (+44)</option>
                  <option value="+91">🇮🇳 (+91)</option>
                  <option value="+27">🇿🇦 (+27)</option>
                </select>
                <div className="h-4 w-px bg-white/30 mx-2" />
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Phone number"
                  className="bg-black text-white placeholder-gray-400 outline-none py-3 flex-1 text-sm"
                />
              </div>
              {formData.phoneNumber && !isValidPhoneNumber(formData.phoneNumber) && (
                <p className="text-red-400 text-xs mt-1">Please enter a valid phone number</p>
              )}
              {error && (
                <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded mt-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                  <p className="text-red-400 text-xs ml-2">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isStep2Valid()}
              className={`w-full py-3 rounded-full text-white font-semibold transition-all flex items-center justify-center ${
                loading || !isStep2Valid() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: 'rgba(96, 60, 208, 1)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </motion.form>
        );

      case 3:
        return (
          <motion.form
            key="step3"
            onSubmit={handleSubmitStep3}
            className="space-y-4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-sm mb-3 font-medium text-center">Enter OTP</label>
              <div className="flex justify-center space-x-2 mb-4">
                {[...Array(6)].map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    data-index={index}
                    value={formData.otp[index] || ''}
                    className="w-10 h-12 text-center bg-black text-white text-lg outline-none border-b-2 border-gray-400 focus:border-white transition-colors"
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  />
                ))}
              </div>
              {error && (
                <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded mb-4">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                  <p className="text-red-400 text-xs ml-2">{error}</p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                disabled={loading || !isStep3Valid()}
                className={`w-full py-3 rounded-full text-white font-semibold transition-all flex items-center justify-center ${
                  loading || !isStep3Valid() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
                }`}
                style={{ backgroundColor: 'rgba(96, 60, 208, 1)' }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  "Continue"
                )}
              </button>

              <div className="text-center">
                {!canResend ? (
                  <p className="text-gray-400 text-sm">
                    Resend code in {countdown} seconds
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="underline hover:opacity-80 flex items-center justify-center mx-auto transition-opacity"
                    style={{ color: 'rgba(96, 60, 208, 1)' }}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                        Sending...
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.form>
        );

      case 4:
        return (
          <motion.form
            key="step4"
            onSubmit={handleSubmitStep4}
            className="space-y-4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-sm mb-2 font-medium">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="w-full py-3 rounded-full pl-4 pr-10 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                >
                  {showPassword ?
                    <EyeOff className="w-4 h-4 text-gray-400 hover:text-white transition-colors" /> :
                    <Eye className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  }
                </button>
              </div>
              <PasswordStrengthIndicator />
            </div>

            <div>
              <label className="block text-sm mb-2 font-medium">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full py-3 rounded-full pl-4 pr-10 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform"
                >
                  {showConfirmPassword ?
                    <EyeOff className="w-4 h-4 text-gray-400 hover:text-white transition-colors" /> :
                    <Eye className="w-4 h-4 text-gray-400 hover:text-white transition-colors" />
                  }
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">Passwords do not match</p>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password && (
                <p className="text-green-400 text-xs mt-1">Passwords match</p>
              )}
            </div>

            {error && (
              <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded">
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                <p className="text-red-400 text-xs ml-2">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isStep4Valid()}
              className={`w-full py-3 rounded-full text-white font-semibold transition-all flex items-center justify-center ${
                loading || !isStep4Valid() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: 'rgba(96, 60, 208, 1)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                "Continue"
              )}
            </button>
          </motion.form>
        );

      case 5:
        return (
          <motion.form
            key="step5"
            onSubmit={handleSubmitStep5}
            className="space-y-4"
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4 }}
          >
            <div>
              <label className="block text-sm mb-2 font-medium">Display Name</label>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="Enter your display name"
                className="w-full py-3 rounded-full pl-4 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white transition-colors"
              />
              {formData.displayName && formData.displayName.trim().length < 2 && (
                <p className="text-red-400 text-xs mt-1">Display name must be at least 2 characters</p>
              )}
              {error && (
                <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded mt-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                  <p className="text-red-400 text-xs ml-2">{error}</p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isStep5Valid()}
              className={`w-full py-3 rounded-full text-white font-semibold transition-all flex items-center justify-center ${
                loading || !isStep5Valid() ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"
              }`}
              style={{ backgroundColor: 'rgba(96, 60, 208, 1)' }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Finishing...
                </>
              ) : (
                "Complete Sign Up"
              )}
            </button>
          </motion.form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 flex justify-center items-center px-4 z-50">
      <div className="bg-[rgba(13,13,13,1)] w-[502px] text-white rounded-2xl shadow-2xl p-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          {step > 1 ? (
            <button
              onClick={handleGoBack}
              className="text-white cursor-pointer font-normal text-sm flex items-center hover:opacity-80 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-4 h-4"></div>
          )}
          <div 
            className="text-sm text-gray-400 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleSkip}
          >
            Skip
          </div>
        </div>

        {/* Title and Description */}
        <div className="mb-6">
          <h2 className="text-lg font-bold mb-2">{getStepTitle()}</h2>
          <p className="text-xs text-gray-400">{getStepDescription()}</p>
        </div>

        {/* Form Content with Animation */}
        <div className="min-h-[400px] relative">
          <AnimatePresence mode="wait">
            {renderStepForm()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SignUp;