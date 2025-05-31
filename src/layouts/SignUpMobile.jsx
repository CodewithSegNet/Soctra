import { useState, useEffect } from "react";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Warning from "../assets/warning.png";
import GoogleIcon from "../assets/google.png";
import AppleIcon from "../assets/apple.png";

const SignUp = ({ apiUrl }) => {
  // Mock navigation - in real app, use react-router's useNavigate
  const navigate = (path) => {
    console.log(`Navigate to: ${path}`);
    // For demo purposes, show success message
    if (path === "/homepage") {
      alert("Sign up completed successfully! Redirecting to homepage...");
    }
  };
  
  const [step, setStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Smooth step transition
  const transitionToStep = (newStep) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setStep(newStep);
      setIsTransitioning(false);
    }, 200);
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
      transitionToStep(2);
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
      transitionToStep(3);
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
      transitionToStep(4);
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
      transitionToStep(5);
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
      // Redirect to homepage after successful completion
      navigate("/homepage");
    }, 1000);
  };

  const handleSkip = () => {
    navigate('/homepage');
  };

  const handleSignIn = () => {
    navigate('/sign-in');
  };

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
      transitionToStep(step - 1);
      setError(null); // Clear any errors when going back
    }
  };

  return (
    <section className="bg-black text-white h-screen flex flex-col overflow-hidden">
      {/* Black status bar */}
      <div className="w-full h-1 bg-black"></div>
      
      <div className="flex flex-col h-full px-4 py-3">
        {/* Header section */}
        <div className="flex-shrink-0">
          <div className="flex justify-between items-center w-full mb-3">
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
            <p
              onClick={handleSkip}
              className="text-white cursor-pointer font-normal text-sm hover:opacity-80 transition-opacity"
            >
              Skip
            </p>
          </div>

          <div className={`transition-all duration-200 ${isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}>
            <h3 className="text-lg font-bold mb-1">
              {step === 1 ? "Get Started with Soctral" :
               step === 2 ? "Verify Your Phone Number" :
               step === 3 ? "Enter OTP" : 
               step === 4 ? "Set Your Password" : "Enter Your Display Name"}
            </h3>
            <p className="text-xs text-gray-300 mb-4">
              {step === 1
                ? "Create an Account to Buy and Sell Social Media Accounts Securely."
                : step === 2
                ? "Enter your phone number to receive a verification code."
                : step === 3
                ? `Enter The 6-Digit Code we Texted to +${getMaskedPhoneNumber()}`
                : step === 4
                ? "Create a strong password for your account."
                : "Enter a Display Name to Represent You on Soctral."}
            </p>
          </div>
        </div>

        {/* Dynamic form content with animation */}
        <div className={`flex flex-col h-full transition-all duration-300 ${
          isTransitioning ? 'opacity-0 translate-x-4' : 'opacity-100 translate-x-0'
        }`}>
          {step === 1 ? (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1 font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email address"
                    className="w-full py-3 rounded-full pl-4 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white text-sm transition-colors"
                  />
                  {formData.email && !isValidEmail(formData.email) && (
                    <p className="text-red-400 text-xs mt-1">Please enter a valid email</p>
                  )}
                </div>

                   {error && (
                  <div className="flex items-center mb-4">
                    <img src={Warning} alt="Warning" className="w-5 h-5" />
                    <p className="text-red-500 text-sm ml-2">{error}</p>
                  </div>
                )}


                <div className="text-center my-3">
                  <p className="text-xs">Or With</p>
                </div>

                       <div className="flex justify-center space-x-8 mb-6">
                  <button type="button" onClick={() => {}}>
                    <img src={GoogleIcon} alt="Google" className="w-8 h-8" />
                  </button>
                  <button type="button" onClick={() => {}}>
                    <img src={AppleIcon} alt="Apple" className="w-8 h-8" />
                  </button>
                </div>


                <div className="flex items-start space-x-2">
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
              </div>

              <div className="space-y-2 mt-4">
                <button
                  onClick={handleSubmitStep1}
                  disabled={loading || !isStep1Valid()}
                  className={`w-full py-3 rounded-full text-white font-semibold transition-all text-sm flex items-center justify-center transform hover:scale-105 ${
                    loading || !isStep1Valid() ? "opacity-50 cursor-not-allowed" : ""
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
                  onClick={handleSignIn}
                  className="w-full py-3 rounded-full bg-black text-white font-semibold text-sm transition-all transform hover:scale-105"
                  style={{ border: '1px solid rgba(96, 60, 208, 1)' }}
                >
                  Sign In
                </button>
              </div>
            </>
          ) : step === 2 ? (
            <>
              <div className="flex items-center justify-center">
                <div className="w-full">
                  <label className="block text-sm mb-2 font-medium">
                    Phone Number
                  </label>
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
                    <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded mt-2 animate-pulse">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                      <p className="text-red-400 text-xs ml-2">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSubmitStep2}
                  disabled={loading || !isStep2Valid()}
                  className={`w-full py-3 rounded-full text-white font-semibold transition-all text-sm flex items-center justify-center transform hover:scale-105 ${
                    loading || !isStep2Valid() ? "opacity-50 cursor-not-allowed" : ""
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
              </div>
            </>
          ) : step === 3 ? (
            <>
              <div className="flex items-center justify-center">
                <div className="w-full">
                  <label className="block text-sm mb-3 font-medium text-center">
                    Enter OTP
                  </label>
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
                    <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded mb-4 animate-pulse">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                      <p className="text-red-400 text-xs ml-2">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <button
                  onClick={handleSubmitStep3}
                  disabled={loading || !isStep3Valid()}
                  className={`w-full py-3 rounded-full text-white font-semibold transition-all text-sm flex items-center justify-center transform hover:scale-105 ${
                    loading || !isStep3Valid() ? "opacity-50 cursor-not-allowed" : ""
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
            </>
          ) : step === 4 ? (
            <>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-2 font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password"
                      className="w-full py-3 rounded-full pl-4 pr-10 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white text-sm transition-colors"
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
                  <label className="block text-sm mb-2 font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your password"
                      className="w-full py-3 rounded-full pl-4 pr-10 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white text-sm transition-colors"
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
                  <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded animate-pulse">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                    <p className="text-red-400 text-xs ml-2">{error}</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSubmitStep4}
                  disabled={loading || !isStep4Valid()}
                  className={`w-full py-3 rounded-full text-white font-semibold transition-all text-sm flex items-center justify-center transform hover:scale-105 ${
                    loading || !isStep4Valid() ? "opacity-50 cursor-not-allowed" : ""
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
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center">
                <div className="w-full">
                  <label className="block text-sm mb-2 font-medium">
                    Display Name
                  </label>
                  <input
                    type="text"
                    name="displayName"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter your display name"
                    className="w-full py-3 rounded-full pl-4 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white text-sm transition-colors"
                  />
                  {formData.displayName && formData.displayName.trim().length < 2 && (
                    <p className="text-red-400 text-xs mt-1">Display name must be at least 2 characters</p>
                  )}
                  {error && (
                    <div className="flex items-center p-2 bg-red-900/30 border border-red-500/50 rounded mt-2 animate-pulse">
                      <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</div>
                      <p className="text-red-400 text-xs ml-2">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={handleSubmitStep5}
                  disabled={loading || !isStep5Valid()}
                  className={`w-full py-3 rounded-full text-white font-semibold transition-all text-sm flex items-center justify-center transform hover:scale-105 ${
                    loading || !isStep5Valid() ? "opacity-50 cursor-not-allowed" : ""
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
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default SignUp;