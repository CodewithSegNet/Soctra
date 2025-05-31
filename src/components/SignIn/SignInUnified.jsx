import React, { useState } from 'react';
import { useScreenSize } from '../../hooks/useScreenSize';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, X } from 'lucide-react';
import Warning from '../../assets/warning.png';

const SignInUnified = ({ apiUrl, onClose }) => {
  const { isMobile } = useScreenSize();
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

  // Shared form logic
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      console.log("Success:", result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reusable form fields
  const PhoneField = () => (
    <div className={isMobile ? "space-y-2" : ""}>
      <label className={`block font-medium ${isMobile ? "text-base mb-4" : "text-base mb-2"}`}>
        Phone Number
      </label>
      <div className={`flex items-center border border-gray-400 bg-black overflow-hidden ${
        isMobile ? "rounded-[90px]" : "rounded-full"
      }`}>
        <select
          name="countryCode"
          value={formData.countryCode}
          onChange={handleInputChange}
          className={`bg-black text-white outline-none ${
            isMobile ? "pl-4 pr-2 py-5" : "pl-4 pr-2 py-4"
          }`}
        >
          <option value="+234">🇳🇬 (+234)</option>
          <option value="+1">🇺🇸 (+1)</option>
          <option value="+44">🇬🇧 (+44)</option>
          <option value="+91">🇮🇳 (+91)</option>
          <option value="+27">🇿🇦 (+27)</option>
        </select>
        <div className={`w-px bg-white/30 mx-3 ${isMobile ? "h-8" : "h-6"}`} />
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
  );

  const EmailField = () => (
    <div className={isMobile ? "space-y-2" : ""}>
      <label htmlFor="email" className={`block font-medium ${isMobile ? "text-base mb-4" : "text-base mb-2"}`}>
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="Email address"
        className={`w-full border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white ${
          isMobile ? "py-5 rounded-[90px] pl-5" : "py-3 rounded-full pl-5"
        }`}
      />
    </div>
  );

  const PasswordField = () => (
    <div className={`relative ${isMobile ? "space-y-2" : ""}`}>
      <label htmlFor="password" className={`block font-medium ${isMobile ? "text-base mb-4" : "text-base mb-2"}`}>
        Password
      </label>
      <div className={`flex items-center border border-gray-400 bg-black overflow-hidden ${
        isMobile ? "rounded-[90px]" : "rounded-full"
      }`}>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          id="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className={`flex-1 bg-black text-white placeholder-gray-400 outline-none ${
            isMobile ? "p-5" : "py-3 pl-5"
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className={`text-gray-300 hover:text-white ${isMobile ? "p-5" : "p-4"}`}
        >
          {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );

  // Mobile Layout
  if (isMobile) {
    return (
      <section className="bg-black text-white h-screen flex flex-col">
        <div className="flex flex-col h-full overflow-auto px-4 py-4">
          <div className="pt-12 mb-10">
            <h3 className="text-2xl font-bold mb-4">Sign In to Soctral</h3>
            <p className="text-sm text-gray-300">
              Sign in with your phone number or email.
            </p>
          </div>

          {/* Method Toggle */}
          <div className="flex justify-center space-x-8 mb-8">
            {["phone", "email"].map((type) => (
              <button
                key={type}
                onClick={() => setMethod(type)}
                className={`relative pb-1 text-base ${
                  method === type ? "font-semibold" : "text-gray-400"
                }`}
              >
                {type === "phone" ? "Phone Number" : "Email Address"}
                {method === type && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-[2px] bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={method}
              className="space-y-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
            >
              {method === "phone" ? <PhoneField /> : <EmailField />}
              <PasswordField />

              {error && (
                <div className="flex items-center space-x-3">
                  <img src={Warning} alt="Warning" className="w-6 h-6" />
                  <p className="text-red-500 text-xl my-[2px] text-left">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full p-5 rounded-[90px] bg-primary text-white font-semibold transition-opacity ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing In..." : "Continue"}
              </button>

              <p className="text-[rgba(255,255,255,0.5)] text-center mx-auto mt-6">
                Don't have an account?{" "}
                <span className="text-white font-normal text-base hover:underline">
                  Sign Up
                </span>
              </p>
            </motion.form>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // Desktop Layout (Modal)
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 flex justify-center items-center px-4">
      <section className="bg-[rgba(13,13,13,1)] w-[502px] rounded-[20px]">
        <div className="relative z-10 w-full bg-[#0F0F0F] rounded-2xl shadow-lg p-6">
          <div className="mb-4 text-left">
            <div className="flex w-full items-center justify-between">
              <h3 className="text-base font-bold mb-2 text-white">
                Sign In to Soctral
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-300">
              Sign in with your phone number or email.
            </p>
          </div>

          {/* Method Toggle */}
          <div className="flex justify-center space-x-8 mb-4">
            {["phone", "email"].map((type) => (
              <button
                key={type}
                onClick={() => setMethod(type)}
                className={`relative pb-1 text-xs ${
                  method === type ? "font-semibold text-white" : "text-gray-400"
                }`}
              >
                {type === "phone" ? "Phone Number" : "Email Address"}
                {method === type && (
                  <span className="absolute left-1/2 -translate-x-1/2 bottom-0 w-12 h-[2px] bg-white rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.form
              key={method}
              className="space-y-5"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
            >
              {method === "phone" ? <PhoneField /> : <EmailField />}
              <PasswordField />

              {error && (
                <div className="flex items-center space-x-3 text-red-500 text-sm">
                  <img src={Warning} alt="Warning" className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-full bg-primary text-white font-semibold transition-opacity ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Signing In..." : "Continue"}
              </button>

              <p className="text-[rgba(255,255,255,0.5)] text-center text-sm mt-6">
                Don't have an account?
                <button className="text-white font-normal text-sm hover:underline ml-1">
                  Sign Up
                </button>
              </p>
            </motion.form>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default SignInUnified;