// layouts/SignInMobile.jsx - Enhanced Version
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MobileNavBar, MobileKeyboardSpacer, useHapticFeedback } from "../Soctra/src/hooks/useDevicestype"

const SignInMobile = ({ apiUrl }) => {
  const navigate = useNavigate();
  const { triggerHaptic } = useHapticFeedback();
  const [method, setMethod] = useState("phone");
  const [formData, setFormData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    countryCode: "+234",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleMethodChange = (newMethod) => {
    triggerHaptic('light');
    setMethod(newMethod);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    triggerHaptic('medium');
    setLoading(true);
    setError(null);

    const payload = method === "phone"
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
      const res = await fetch(`${apiUrl}/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to sign in");
      const result = await res.json();
      triggerHaptic('success');
      console.log("Success:", result);
    } catch (err) {
      triggerHaptic('error');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const PhoneField = () => (
    <div className="space-y-3">
      <label className="block font-medium text-white text-base">
        Phone Number
      </label>
      <div className="flex items-center border border-gray-600 bg-gray-900/50 rounded-2xl overflow-hidden mobile-transition focus-within:border-white focus-within:bg-gray-900">
        <select
          name="countryCode"
          value={formData.countryCode}
          onChange={handleInputChange}
          className="bg-transparent text-white outline-none pl-4 pr-2 py-5 mobile-button"
        >
          <option value="+234" className="bg-gray-900">🇳🇬 (+234)</option>
          <option value="+1" className="bg-gray-900">🇺🇸 (+1)</option>
          <option value="+44" className="bg-gray-900">🇬🇧 (+44)</option>
          <option value="+91" className="bg-gray-900">🇮🇳 (+91)</option>
          <option value="+27" className="bg-gray-900">🇿🇦 (+27)</option>
        </select>
        <div className="w-px bg-gray-600 mx-3 h-8" />
        <input
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleInputChange}
          placeholder="Phone number"
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none py-5 pr-4 text-base"
        />
      </div>
    </div>
  );

  const EmailField = () => (
    <div className="space-y-3">
      <label htmlFor="email" className="block font-medium text-white text-base">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email address"
        className="w-full border border-gray-600 bg-gray-900/50 text-white placeholder-gray-400 outline-none py-5 px-4 rounded-2xl text-base mobile-transition focus:border-white focus:bg-gray-900"
      />
    </div>
  );

  const PasswordField = () => (
    <div className="space-y-3">
      <label htmlFor="password" className="block font-medium text-white text-base">
        Password
      </label>
      <div className="flex items-center border border-gray-600 bg-gray-900/50 rounded-2xl overflow-hidden mobile-transition focus-within:border-white focus-within:bg-gray-900">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none py-5 pl-4 text-base"
        />
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light');
            setShowPassword((prev) => !prev);
          }}
          className="text-gray-400 hover:text-white p-4 mobile-button"
        >
          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-black text-white min-h-screen flex flex-col">
      <MobileNavBar 
        title="" 
        onBack={() => navigate(-1)}
      />
      
      <div className="flex-1 px-6 py-8 flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-3 text-white">
            Welcome back
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Sign in to continue to your account
          </p>
        </div>

        {/* Method Toggle */}
        <div className="flex bg-gray-900/30 rounded-2xl p-1 mb-8">
          {["phone", "email"].map((type) => (
            <button
              key={type}
              onClick={() => handleMethodChange(type)}
              className={`flex-1 py-3 px-4 rounded-xl text-base font-medium mobile-transition mobile-button ${
                method === type 
                  ? "bg-white text-black shadow-lg" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {type === "phone" ? "Phone" : "Email"}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.form
              key={method}
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onSubmit={handleSubmit}
            >
              {method === "phone" ? <PhoneField /> : <EmailField />}
              <PasswordField />

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl bg-white text-black font-semibold text-base mobile-transition mobile-button ${
                    loading ? "opacity-50 cursor-not-allowed" : "active:bg-gray-100"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent mr-2"></div>
                      Signing In...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>
            </motion.form>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-base">
            Don't have an account?{" "}
            <button 
              onClick={() => {
                triggerHaptic('light');
                navigate('/sign-up');
              }}
              className="text-white font-medium hover:underline mobile-button"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
      
      <MobileKeyboardSpacer />
    </div>
  );
};

export default SignInMobile;