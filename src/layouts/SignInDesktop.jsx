import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import Warning from "../assets/warning.png";
import { X } from "lucide-react";
import SignUp from "../layouts/SignUpDesktop";

const SignIn = ({ apiUrl, onClose }) => {
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
  const [isSignInVisible, setIsSignInVisible] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

  const toggleModal = () => {
    setIsSignInVisible((prev) => !prev);
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70 flex justify-center items-center px-4">
        <section className="bg-[rgba(13,13,13,1)] w-[502px] rounded-[20px]">
          <div className="relative z-10 w-full bg-[#0F0F0F] rounded-2xl shadow-lg p-[24px]">
            <div className="mb-[0.8rem] text-left">
              <div className="flex w-full items-center justify-between">
                <h3 className="text-[16px] font-bold mb-[10px] text-white">
                  {isSignInVisible ? "Sign In to Soctral" : "Sign Up for Soctral"}
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-[12px] text-gray-300">
                {isSignInVisible
                  ? "Sign in with your phone number or email."
                  : "Sign up to create a new account."}
              </p>
            </div>

            <div className="flex justify-center space-x-8 mb-[1rem]">
              {["phone", "email"].map((type) => (
                <button
                  key={type}
                  onClick={() => setMethod(type)}
                  className={`relative pb-1 text-[12px] ${
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

            <AnimatePresence mode="wait">
              <motion.form
                key={isSignInVisible ? "signIn" : "signUp"}
                className="space-y-5"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
              >
                {/* Phone or Email */}
                {method === "phone" ? (
                  <div>
                    <label className="block text-base text-white font-medium mb-2">Phone Number</label>
                    <div className="flex items-center text-base border border-gray-400 rounded-full bg-black overflow-hidden">
                      <select
                        name="countryCode"
                        value={formData.countryCode}
                        onChange={handleInputChange}
                        className="bg-black text-base text-white pl-4 pr-2 py-4 outline-none"
                      >
                        <option className="text-base" value="+234">🇳🇬 (+234)</option>
                        <option className="text-base" value="+1">🇺🇸 (+1)</option>
                        <option className="text-base" value="+44">🇬🇧 (+44)</option>
                        <option className="text-base" value="+91">🇮🇳 (+91)</option>
                        <option className="text-base" value="+27">🇿🇦 (+27)</option>
                      </select>
                      <div className="h-6 w-px bg-white/30 mx-3" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="Phone number"
                        className="flex-1 bg-black text-white py-3 placeholder-gray-400 outline-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="email" className="block text-base text-white font-medium mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email address"
                      className="w-full py-3 rounded-full pl-5 border border-gray-400 bg-black text-white placeholder-gray-400 outline-none focus:border-white"
                    />
                  </div>
                )}

                {/* Password */}
                <div className="relative">
                  <label htmlFor="password" className="block text-base text-white font-medium mb-2">Password</label>
                  <div className="flex items-center border border-gray-400 rounded-full bg-black overflow-hidden">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password"
                      className="flex-1 py-3 pl-5 bg-black text-white placeholder-gray-400 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="p-4 text-gray-300 hover:text-white"
                    >
                      {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center space-x-3 text-red-500 text-base">
                    <img src={Warning} alt="Warning" className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-full bg-primary text-white font-semibold transition-opacity ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Signing In..." : isSignInVisible ? "Continue" : "Sign Up"}
                </button>

                <p className="text-[rgba(255,255,255,0.5)] text-center text-base mt-6">
                  {isSignInVisible ? (
                    <>
                      Don’t have an account?
                      <button
                        onClick={toggleModal}
                        className="text-white font-normal text-base hover:underline ml-1"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?
                      <button
                        onClick={toggleModal} 
                        className="text-white font-normal text-base hover:underline ml-1"
                      >
                        Sign In
                      </button>
                    </>
                  )}
                </p>
              </motion.form>
            </AnimatePresence>

            {/* Conditionally render SignUp Component */}
            {!isSignInVisible && <SignUp apiUrl={apiUrl} />}
          </div>
        </section>
      </div>
    </>
  );
};

export default SignIn;
