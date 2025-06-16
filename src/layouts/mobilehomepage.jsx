import { useState } from "react";
import dotmenu from "../assets/menu.svg"
import gift from "../assets/gift.svg"
import notification from "../assets/notifications.svg"
import buy from "../assets/buy.svg"
import plus from "../assets/plus.svg"
import withdraw from "../assets/withdrawal.svg"
import frame1 from "../assets/frame1.svg"
import frame2 from "../assets/frame2.svg"
import frame3 from "../assets/frame3.svg"
import frame0 from "../assets/slide11.svg"
import frame00 from "../assets/slide1.svg"
import frame000 from "../assets/slide0.svg"

import { useEffect, useRef } from 'react';
import { Home, Wallet, MessageCircle, History, Plus, Eye, EyeOff, TrendingUp, Star, Users, Instagram, Twitter, Facebook, ChevronRight, ChevronDown } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const HomePage = () => {
 const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  // Mock data
  const walletBalance = 25000.50;

  const currencies = [
    { name: 'USDT', rate: '12,232.0', change: '+1.8%', symbol: '$' },
    { name: 'BTC', rate: '65,432.0', change: '+2.5%', symbol: '₿' },
    { name: 'Solana', rate: '142.8', change: '-1.2%', symbol: 'SOL' }
  ];

  // Slick carousel settings
  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };


    // Slick carousel settings
  const slickSettings2 = {
    dots: false,
    infinite: true,
    speed: 380,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const getCurrentCurrency = () => {
    return currencies.find(c => c.name === selectedCurrency) || currencies[0];
  };

  return (
    <>
      <style jsx>{`
        /* Prevent zoom on input focus for mobile devices */
        input[type="search"] {
          font-size: 16px !important;
        }
        
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }

        /* Slick carousel custom styles */
        .slick-slider {
          margin: 0;
        }
        
        .slick-list {
          padding: 0;
        }
        
        .slick-track {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .slick-slide {
          width: auto !important;
          margin-right: 12px;
        }
        
        .slick-slide > div {
          display: flex;
          align-items: center;
        }
      `}</style>
      
      <div className="bg-black text-white min-h-screen relative">
        {/* Status bar */}
        <div className="w-full h-1 bg-black"></div>
        
        {/* Main content - scrollable with bottom padding for nav */}
        <div className="pb-20 custom-scrollbar overflow-y-auto h-screen">
          {/* Header */}
          <div className="px-4 pt-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <img src={dotmenu} alt="" className="h-[20px] w-[20px] "/>
                <h1 className="text-[24px] font-normal">Welcome to Soctral</h1>
              </div>
              <div className="flex gap-4 items-center justify-center">
                <img src={gift} alt="" className="h-[20px] w-[20px] " />
                <img src={notification} alt="" className="h-[20px] w-[20px] "/>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-2">
              <div className="bg-white p-5 rounded-lg text-[#3B3B3B]">
                <h3 className="font-semibold text-[20px] pb-1">Create Your Account Now</h3>
                <p className="font-normal text-[16px] pb-2">Create Your Soctral Account Now and Unlock Secure Social Media Trading Opportunities.</p>

                <div className="flex items-center justify-between text-[14px] whitespace-nowrap font-medium">
                  <button className="py-[7px] px-[50px] bg-primary rounded-full text-white">
                    Sign Up
                  </button>
                  <button className="py-[7px] px-[50px] bg-[#DCD0FF] rounded-full text-primary">
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Wallet Balance Card */}
          <div className="px-4 mb-6">
            <h3 className="mb-1 font-[600] text-[16px]"> Wallet Balance</h3>
            <div className="bg-[#181818] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">

                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <p className="text-white/80 text-sm mb-2">Currency:</p>

                        {/* Currency Dropdown */}
                        <div className="flex items-baseline relative mb-4">
                          <button
                            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                            className="flex items-center justify-between w-full rounded-lg text-white transition-colors"
                          >
                            <span className="font-medium ">{selectedCurrency}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCurrencyDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] w-[150%] rounded-lg border border-white/10 z-20">
                              {currencies.map((currency) => (
                                <button
                                  key={currency.name}
                                  onClick={() => {
                                    setSelectedCurrency(currency.name);
                                    setShowCurrencyDropdown(false);
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                >
                                  <div className="font-medium">{currency.name}</div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Currency Rate Display */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{getCurrentCurrency().rate}</span>
                          <span className={`text-sm ${getCurrentCurrency().change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                            {getCurrentCurrency().change}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Balance Display */}
                    <div className="flex items-center justify-center space-x-2 mb-6 mt-5">
                      <span className="text-2xl font-bold text-white">
                        {getCurrentCurrency().symbol}{showBalance ? walletBalance.toLocaleString() : '••••••'}
                      </span>
                      <button
                        onClick={() => setShowBalance(!showBalance)}
                        className="text-white/80 hover:text-white transition-colors"
                      >
                        {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <button className="flex items-center justify-center gap-1 flex-1 py-[7px] whitespace-nowrap px-[40px] bg-primary text-xs rounded-full text-white font-medium hover:bg-purple-700 transition-colors">
                        <img src={plus} alt="" />
                        Fund Wallet
                      </button>
                      <button className="flex items-center justify-center gap-1 flex-1 py-[7px] px-[40px] bg-[#DCD0FF] text-xs rounded-full text-primary font-medium hover:bg-purple-100 transition-colors">
                        <img src={withdraw} alt="" />
                        Withdraw
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

                <div className="px-4 mb-6">
            <h3 className="mb-1 font-[600] text-[16px]">
              Pick of the Week
              </h3>
            <div className="w-full">
              <Slider {...slickSettings2}>
                <div>
                  <img src={frame0} alt="" />
                </div>
                <div>
                  <img src={frame00} alt="" />
                </div>
                <div>
                  <img src={frame000} alt="" />
                </div>
       <div>
                  <img src={frame0} alt="" />
                </div>
                <div>
                  <img src={frame00} alt="" />
                </div>
                <div>
                  <img src={frame000} alt="" />
                </div>
              </Slider>
            </div>
          </div>


          <div className="px-4 mb-6">
            <h3 className="mb-1 font-[600] text-[16px]">
              Explore Soctral
            </h3>
            <div className="w-full">
              <Slider {...slickSettings}>
                <div>
                  <img src={frame3} alt="" />
                </div>
                <div>
                  <img src={frame2} alt="" />
                </div>
                <div>
                  <img src={frame1} alt="" />
                </div>
                <div>
                  <img src={frame3} alt="" />
                </div>
                <div>
                  <img src={frame2} alt="" />
                </div>
                <div>
                  <img src={frame1} alt="" />
                </div>
              </Slider>
            </div>
          </div>

          {/* Extra padding for scroll */}
          <div className="h-6"></div>
        </div>

        {/* Bottom Navigation - Fixed with high z-index */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#181818] z-50">
          <div className="flex items-center justify-around py-2 px-4">
            {/* Home */}
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                activeTab === 'home' 
                  ? 'text-primary' 
                  : 'text-gray-400'
              }`}
            >
              <Home className={`w-5 h-5 mb-1 transition-colors duration-200 ${
                activeTab === 'home' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-purple-300'
              }`} />
              <span className={`text-xs transition-colors duration-200 ${
                activeTab === 'home' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`}>Home</span>
            </button>

            {/* Wallet */}
            <button
              onClick={() => setActiveTab('wallet')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                activeTab === 'wallet' 
                  ? 'text-primary' 
                  : 'text-gray-400'
              }`}
            >
              <Wallet className={`w-5 h-5 mb-1 transition-colors duration-200 ${
                activeTab === 'wallet' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-purple-300'
              }`} />
              <span className={`text-xs transition-colors duration-200 ${
                activeTab === 'wallet' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`}>Wallet</span>
            </button>

            {/* Buy/Sell - Prominent center button */}
            <button
              onClick={() => setActiveTab('trade')}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 absolute bg-black top-[-28px] rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-all duration-200 mb-1">
                <img src={buy} className="p-2" />
              </div>
              <span className="text-xs text-gray-400 pt-[1.5rem] transition-colors duration-200 hover:text-primary">Buy/Sell</span>
            </button>

            {/* Chat */}
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                activeTab === 'chat' 
                  ? 'text-primary' 
                  : 'text-gray-400'
              }`}
            >
              <MessageCircle className={`w-5 h-5 mb-1 transition-colors duration-200 ${
                activeTab === 'chat' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`} />
              <span className={`text-xs transition-colors duration-200 ${
                activeTab === 'chat' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`}>Chat</span>
            </button>

            {/* History */}
            <button
              onClick={() => setActiveTab('history')}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                activeTab === 'history' 
                  ? 'text-primary' 
                  : 'text-gray-400'
              }`}
            >
              <History className={`w-5 h-5 mb-1 transition-colors duration-200 ${
                activeTab === 'history' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`} />
              <span className={`text-xs transition-colors duration-200 ${
                activeTab === 'history' 
                  ? 'text-primary' 
                  : 'text-gray-400 hover:text-primary'
              }`}>History</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;