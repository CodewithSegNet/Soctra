import { useState } from "react";
import { useEffect, useRef } from 'react';
import { Home, Wallet, MessageCircle, History, Plus, Eye, EyeOff, TrendingUp, Star, ArrowLeft, X, User, Instagram, Twitter, Facebook, ChevronRight, ChevronDown, Menu, Gift, Bell } from "lucide-react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import dotmenu from "../assets/menu.svg";
import withdraw from "../assets/withdrawal.svg";
import btc from "../assets/btc.svg"
import usdt from "../assets/usdt.svg"
import eth from "../assets/eth.svg"
import frame0 from "../assets/frame1.svg"
import frame00 from "../assets/frame2.svg"
import frame000 from "../assets/frame3.svg"
import {  MoreHorizontal, Heart, ShoppingCart } from 'lucide-react';
import badge from "../assets/verifiedstar.svg"
import ig from "../assets/ig.svg"
import linkedin from "../assets/linkedin.svg"
import tik from "../assets/tik.svg"
import ig2 from "../assets/socialicon.svg"
import ug1 from "../assets/ug1.png"
import ug2 from "../assets/ug2.png"
import ug3 from "../assets/ug3.png"
import ug4 from "../assets/ug4.jpg"
import profile from "../assets/profile.svg"
import { HelpCircle, Info,  LogOut } from 'lucide-react';




const HomePage = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCurrency, setSelectedCurrency] = useState('USDT');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [tableHeight, setTableHeight] = useState(320); 
  const [showSlideMenu, setShowSlideMenu] = useState(false);
  const [showFundModal, setShowFundModal] = useState(false);
const [selectedCrypto, setSelectedCrypto] = useState(null);
const [modalStep, setModalStep] = useState(1); // 1 for select asset, 2 for input amount
const [amount, setAmount] = useState('');


  const tableContainerRef = useRef(null);
  const mainContentRef = useRef(null);



  // Mock data
  const walletBalance = 25000.50;

  const currencies = [
    { name: 'USDT', rate: '12,232.0', change: '+1.8%', symbol: '$' },
    { name: 'BTC', rate: '65,432.0', change: '+2.5%', symbol: '₿' },
    { name: 'Solana', rate: '142.8', change: '-1.2%', symbol: 'SOL' }
  ];

  // Crypto currencies for the new section
  const cryptoCurrencies = [
    { name: 'BTC', rate: '67,234.0', change: '+3.2%', symbol: '₿', balance: '0.0' },
    { name: 'USDT', rate: '1.001', change: '+0.1%', symbol: '$', balance: '0.0' },
    { name: 'ETH', rate: '3,456.8', change: '+2.8%', symbol: 'Ξ', balance: '0.0' }
  ];


const cryptoImages = {
  'Bitcoin': btc,
  'BTC': btc,
  'Ethereum': eth,
  'ETH': eth,
  'Tether': usdt,
  'USDT': usdt,
}




  // Placeholder images for slides
  const slideImages = [
frame0,
frame00,
frame000
  ];



    const tableData = [
    {
      id: 1,
      seller: {
        image: ug1,
        name: "UB.greatilx",
        verified: true
      },
      item: {
        image: ig,
        name: "Instagram"
      },
      followers: "1.3k",
      rating: 4.5
    },
    {
      id: 2,
      seller: {
        image: ug2,
        name: "ug.jimmy",
        verified: true
      },
      item: {
        image: tik,
        name: "TikTok"
      },
      followers: "8.3k",
      rating: 5.0
    },
    {
      id: 3,
      seller: {
        image: ug3,
        name: "ug.wilson",
        verified: false
      },
      item: {
        image: linkedin,
        name: "Linkedin"
      },
      followers: "4.2",
      rating: 3.8
    },
    {
      id: 4,
      seller: {
        image: ug4,
        name: "ug.jones",
        verified: true
      },
      item: {
        image: ig2,
        name: "facebook"
      },
      followers: "2.1k",
      rating: 4.7
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={7}
          className={i <= rating ? "fill-orange-600 text-orange-600" : "text-gray-600"}
        />
      );
    }
    return stars;
  };



  // Calculate dynamic table height based on available space
  useEffect(() => {
    const calculateTableHeight = () => {
      if (tableContainerRef.current && mainContentRef.current) {
        const mainContentRect = mainContentRef.current.getBoundingClientRect();
        const tableContainerRect = tableContainerRef.current.getBoundingClientRect();
        
        // Get the viewport height
        const viewportHeight = window.innerHeight;
        
        // Calculate available space from table container to bottom of viewport
        const availableSpace = viewportHeight - tableContainerRect.top - 100; // 100px buffer
        
        // Get height of other content above the table
        const exploreSection = document.querySelector('[data-section="explore"]');
        const tableTitleSection = document.querySelector('[data-section="table-title"]');
        
        let otherContentHeight = 0;
        if (exploreSection) otherContentHeight += exploreSection.offsetHeight;
        if (tableTitleSection) otherContentHeight += tableTitleSection.offsetHeight;
        
        // Calculate table body height (subtract header height ~60px and some padding)
        const maxTableHeight = Math.max(200, availableSpace - otherContentHeight - 120);
        
        setTableHeight(Math.min(maxTableHeight, 500)); // Cap at 500px max
      }
    };

    // Initial calculation
    calculateTableHeight();

    // Recalculate on window resize
    window.addEventListener('resize', calculateTableHeight);
    
    // Cleanup
    return () => window.removeEventListener('resize', calculateTableHeight);
  }, []);

   const headerRef = useRef(null); 
          const bodyRef = useRef(null);


          useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSlideMenu && !event.target.closest('.slide-menu') && !event.target.closest('.dot-menu')) {
        setShowSlideMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSlideMenu]);


  

  // Slick carousel settings for desktop
  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    gap: 5,
    swipeToSlide: true,
  };

  const slickSettings2 = {
    dots: true,
    infinite: true,
    speed: 380,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    swipeToSlide: true,
  };

  const getCurrentCurrency = () => {
    return currencies.find(c => c.name === selectedCurrency) || currencies[0];
  };

  return (
    <>
      <style jsx>{`
        /* Custom scrollbar */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        }

        /* Slick carousel custom styles */
        .slick-slider {
          margin: 0;
        }
        
        .slick-dots {
          bottom: -40px;'

        }
        
        .slick-dots li button:before {
          color: #7C3AED;
          font-size: 8px;
        }
        
        .slick-dots li.slick-active button:before {
          color: #7C3AED;
        }
        
        .slick-arrow {
          z-index: 10;
        }
        
        .slick-prev {
          left: 10px;
        }
        
        .slick-next {
          right: 10px;
        }
        
        .slick-prev:before,
        .slick-next:before {
          color: #7C3AED;
          font-size: 20px;
        }


/* Method 1: Using Tailwind CSS utility classes */
/* Add these custom utilities to your Tailwind config or CSS */

@layer utilities {
  .no-scrollbar {
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
  
  /* Hide scrollbar for Chrome, Safari and Opera */
  .no-scrollbar::-webkit-scrollbar {
    display: none;
  }
  
  .hide-scroll {
    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .hide-scroll::-webkit-scrollbar {
    display: none;
  }
}

/* Method 2: Direct CSS for your main element */
.main-container {
  overflow-y: auto;
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.main-container::-webkit-scrollbar {
  display: none;
}

/* Method 3: Hide scrollbars for Slick carousel specifically */
.slick-list {
  overflow: hidden !important;
}

.slick-track {
  overflow: hidden !important;
}

/* Method 4: Global scrollbar hiding (use with caution) */
* {
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Hide scrollbar for Chrome, Safari and Opera */
*::-webkit-scrollbar {
  display: none;
}

/* Method 5: Custom scrollbar that's invisible */
.invisible-scrollbar {
  overflow-y: auto;
}

.invisible-scrollbar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

.invisible-scrollbar::-webkit-scrollbar-thumb {
  background: transparent;
}


      `}</style>
      
          <div className="bg-black text-white min-h-screen relative">
        {/* Overlay for slide menu */}
        {showSlideMenu && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300" />
        )}

        {/* Desktop Navigation Bar */}
        <nav className="bg-[#181818] border-b border-white/10 px-6 py-4 relative z-50">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <button 
                className="dot-menu"
                onClick={() => setShowSlideMenu(!showSlideMenu)}
              >
                <div className="h-[20px] w-[20px] cursor-pointer hover:opacity-80 transition-opacity">
        <img src={dotmenu} alt="" />
                </div>
              </button>
              <h1 className="text-base font-medium">Welcome to Soctral</h1>

              {/* Desktop Navigation Links */}
              <div className="flex items-center text-base gap-4">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'home' ? 'text-purple-300' : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  <span>Home</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('wallet')}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'wallet' ? 'text-purple-300' : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  <span>Wallet</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('trade')}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'trade' ? 'text-purple-300' : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  <span>Buy/Sell</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'chat' ? 'text-purple-300' : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  <span>Chat</span>
                </button>
                
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex items-center gap-2 rounded-lg transition-all duration-200 ${
                    activeTab === 'history' ? 'text-purple-300' : 'text-gray-300 hover:text-purple-300'
                  }`}
                >
                  <span>History</span>
                </button>
              </div>
            </div>
            
            <div className="flex gap-3">
              {/* Right side icons */}
              <div className="flex items-center gap-2">
                <div className="bg-[rgba(255,255,255,0.1);] rounded-full p-2">
                  <Gift className="h-4 w-4 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                </div>
                <div className="bg-[rgba(255,255,255,0.1);] rounded-full p-2">
                  <Bell className="h-4 w-4 text-gray-300 hover:text-white cursor-pointer transition-colors" />
                </div>
              </div>
              <button className="flex-1 py-2 text-[12px] whitespace-nowrap px-9 bg-primary rounded-full text-white font-medium hover:bg-purple-700 transition-colors">
                Sign Up
              </button>
              <button className="flex-1 text-[12px] whitespace-nowrap py-2 px-9 bg-purple-100 rounded-full text-purple-600 font-medium hover:bg-purple-200 transition-colors">
                Sign In
              </button>
            </div>
          </div>
        </nav>





<div className={`slide-menu fixed top-[88px] left-0 w-80 z-50 transform transition-transform duration-300 ease-in-out ${
  showSlideMenu ? 'translate-x-5' : '-translate-x-full'
}`}
style={{
  height: 'calc(100vh - 88px - 48px)'
}}
>
  <div className="p-4  flex flex-col w-full bg-[#181818] rounded-md overflow-y-auto">
    {/* Close Button */}
    <div className="flex justify-start items-center mb-4">
      <button 
        onClick={() => setShowSlideMenu(false)}
        className="p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
    
    {/* Profile Section */}
    <div className="flex flex-col items-center mb-6">
      <div className="w-24 h-24 rounded-full flex items-center justify-center mb-2">
        <img src={profile} className="w-20 h-20 rounded-full" />
      </div>
      <p className="text-gray-300 font-[400] text-sm text-center">
        Guest
      </p>
    </div>
    
    {/* Sign Up/Sign In Buttons */}
    <div className="flex gap-3 mb-3">
      <button className="flex-1 py-2.5 bg-primary text-xs rounded-full text-white font-medium hover:bg-purple-700 transition-colors">
        Sign Up
      </button>
      <button className="flex-1 py-2.5 bg-purple-100 text-xs rounded-full text-purple-600 font-medium hover:bg-purple-200 transition-colors">
        Sign In
      </button>
    </div>
      </div>


    {/* Support Section */}
    <div className="my-2 bg-[#181818] rounded-md p-2">
      <h3 className="text-xs font-semibold mb-1 px-2">Support</h3>
      <div className="">
        {/* Help Center & Support */}
        <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
          <HelpCircle className="w-5 h-5 text-gray-400" />
          <span className="text-white text-xs">Help Center & Support</span>
        </div>
        
        {/* About Us */}
        <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
          <Info className="w-5 h-5 text-gray-400" />
          <span className="text-white text-xs">About Us</span>
        </div>
        
        {/* Rate Our App */}
        <div className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
          <Star className="w-5 h-5 text-gray-400" />
          <span className="text-white text-xs">Rate Our App</span>
        </div>
      </div>
    </div>


    {/* Sign Out Section - Push to bottom */}
    <div className="my-3 bg-[#181818] rounded-md">
      <div className="flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors group">
        <LogOut className="w-5 h-5 text-red-500 group-hover:text-red-400" />
        <span className="text-red-500 group-hover:text-red-400 font-medium text-xs">Sign Out</span>
      </div>
    </div>
</div>


        {/* Fund Wallet Modal */}
     {showFundModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="bg-[#181818] rounded-xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {modalStep === 2 && (
            <button 
              onClick={() => setModalStep(1)}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <h3 className="text-md font-semibold">
            {modalStep === 1 ? 'Select Asset' : 'Fund Wallet'}
          </h3>
        </div>
        <button 
          onClick={() => {
            setShowFundModal(false);
            setModalStep(1);
            setSelectedCrypto(null);
            setAmount('');
          }}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      {modalStep === 1 ? (
        // Step 1: Select Asset
        <div className="">
          {cryptoCurrencies.map((crypto, index) => (
            <div 
              key={crypto.name} 
              className={`cursor-pointer rounded-lg transition-colors ${
                selectedCrypto?.name === crypto.name 
                  ? 'bg-gray-700' 
                  : 'hover:bg-white/5'
              }`}
              onClick={() => {
                setSelectedCrypto(crypto);
                setModalStep(2);
              }}
            >
              <div className="flex items-center justify-between">
                <div className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <img 
                      className="text-xs font-bold" 
                      src={cryptoImages[crypto.name] || cryptoImages[crypto.symbol] || btc} 
                      alt={`${crypto.name} logo`}
                    />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      {crypto.name} <span className="text-gray-700">{crypto.symbol}</span>
                    </div>
                    <div className="text-xs text-gray-400">Balance: {crypto.balance}</div>
                  </div>
                </div>

                <div className="flex flex-col p-2 items-end gap-1">
                  <span className="text-white text-sm font-medium">{crypto.rate}</span>
                  <span className={`text-xs ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {crypto.change}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Step 2: Input Amount
        <div className="space-y-6">
          {/* Selected Crypto Display */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg">
            <div className="w-7 h-7 bg-purple-600 rounded-full flex items-center justify-center">
              <img 
                className="w-6 h-6" 
                src={cryptoImages[selectedCrypto.name] || cryptoImages[selectedCrypto.symbol] || btc} 
                alt={`${selectedCrypto.name} logo`}
              />
            </div>
            <div>
              <div className="font-medium">
                {selectedCrypto.name} <span className="text-gray-700">{selectedCrypto.symbol}</span>
              </div>
              <div className="text-xs text-gray-400">Current Rate: {selectedCrypto.rate}</div>
            </div>
          </div>

          {/* Amount Input */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <div className="relative">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-lg font-medium focus:outline-none focus:border-purple-500 transition-colors"
                />
                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  {selectedCrypto.symbol}
                </span>
              </div>
            </div>

            {/* USD Equivalent */}
            {amount && (
              <div className="text-center text-gray-400 text-sm">
                ≈ ${(parseFloat(amount) * parseFloat(selectedCrypto.rate.replace(/[$,]/g, ''))).toLocaleString()} USD
              </div>
            )}

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-4 gap-2">
              {['25', '50', '100', '500'].map((quickAmount) => (
                <button
                  key={quickAmount}
                  onClick={() => setAmount(quickAmount)}
                  className="py-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  {quickAmount}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => setModalStep(1)}
              className="flex-1 py-3 px-4 border border-white/20 text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => {
                // Handle fund wallet logic here
                console.log(`Funding wallet with ${amount} ${selectedCrypto.symbol}`);
                setShowFundModal(false);
                setModalStep(1);
                setSelectedCrypto(null);
                setAmount('');
              }}
              disabled={!amount || parseFloat(amount) <= 0}
              className="flex-1 py-3 px-4 bg-primary text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Fund Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
)}


        {/* Main Desktop Layout */}
        <div className="flex max-w-7xl mx-auto p-6 gap-6 min-h-[calc(100vh-88px)]">
          {/* Left Aside - Wallet Balance */}
          <aside className="w-80 flex-shrink-0">
            {/* Wallet Balance Card */}
            <div className="bg-[#181818] h-full rounded-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="relative z-10">
                <div className="p-6">
                  <h3 className="font-semibold text-base mb-[1.5rem]">Wallet Balance</h3>
                  
                  <div className="flex items-center text-[11px] justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-centers gap-1">
                        <p className="text-white/80 text-xs">Currency:</p>
                        {/* Currency Dropdown */}
                        <div className="relative">
                          <button
                            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                            className="flex items-center gap-1"
                          >
                            <span className="text-xs font-medium">{selectedCurrency}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
                          </button>
                          
                          {showCurrencyDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-[#2a2a2a] rounded-lg border border-white/10 z-20 min-w-[120px]">
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
                    </div>

                    {/* Currency Rate Display */}
                    <div className="flex items-center gap-2">
                      <span className="text-white pt-[1px] font-medium">{getCurrentCurrency().rate}</span>
                      <span className={`text-xs ${getCurrentCurrency().change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                        {getCurrentCurrency().change}
                      </span>
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="flex items-center justify-center gap-3 mb-5 py-[1.2rem]">
                    <span className="text-md font-bold text-white">
                      {getCurrentCurrency().symbol}{showBalance ? walletBalance.toLocaleString() : '••••••'}
                    </span>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="text-white/80 hover:text-white transition-colors"
                    >
                      {showBalance ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setShowFundModal(true)}
                      className="flex items-center text-[11px] justify-center gap-2 w-full py-[.5rem] whitespace-nowrap px-4 bg-primary rounded-full text-white font-medium hover:bg-purple-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Fund Wallet
                    </button>
                    <button className="flex items-center text-[11px] justify-center gap-2 w-full py-[.5rem] px-2 bg-purple-100 rounded-full text-purple-600 font-medium hover:bg-purple-200 transition-colors">
                   <img src={withdraw} className="h-4 w-4" alt="" />
                      Withdraw
                    </button>
                  </div>
                </div>

   

<div className="pb-[2rem]">
{cryptoCurrencies.map((crypto, index) => (
  <div key={crypto.name} className="">
    <div className="flex items-center border-t border-gray-700 justify-between">
      <div className="p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
          <img 
            className="text-xs font-bold" 
            src={cryptoImages[crypto.name] || cryptoImages[crypto.symbol] || btc} 
            alt={`${crypto.name} logo`}
          />
        </div>
        <div>
          <div className="font-medium text-sm">{crypto.name}</div>
          <div className="text-xs text-gray-400">Balance: {crypto.balance}</div>
        </div>
      </div>

      <div className="flex flex-col p-2 items-end gap-1">
        <span className="text-white text-sm font-medium">{crypto.rate}</span>
        <span className={`text-xs ${crypto.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {crypto.change}
        </span>
      </div>
    </div>
  </div>
))}
</div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 flex flex-col gap-4 overflow-y-auto no-scrollbar">
            {/* Explore Soctral Section */}
            <section>
              <h3 className="mb-4 font-semibold text-base">Explore Soctral</h3>
              <div className="rounded-xl">
                <Slider {...slickSettings}>
                  {slideImages.map((img, index) => (
                    <div key={index} className="px-2">
                      <img 
                        src={img} 
                        alt={`Explore Soctral ${index + 1}`} 
                        className="w-full object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            </section>

            <section ref={tableContainerRef} className="flex-1 flex flex-col min-h-0">
              <div data-section="table-title" className="mb-4">
                <h3 className="font-semibold text-base text-white">Pick of the Week</h3>
              </div>
              
              {/* Professional Table Container with Dynamic Height */}
              <div className="relative rounded-xl bg-neutral-900 shadow-2xl overflow-hidden flex-1 flex flex-col">
                
                {/* Fixed Header */}
                <div className="flex-shrink-0 border-b border-gray-700 bg-[#2c2a2f]">
                  <div 
                    className="overflow-hidden"
                    ref={headerRef}
                    style={{ scrollBehavior: 'auto' }}
                  >
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left py-4 px-6 text-white font-semibold text-base whitespace-nowrap min-w-[60px]">
                            
                          </th>
                          <th className="text-left py-4 px-6 text-white font-semibold text-base whitespace-nowrap min-w-[200px]">
                            Seller
                          </th>
                          <th className="text-left py-4 px-6 text-white font-semibold text-base whitespace-nowrap min-w-[250px]">
                            Items
                          </th>
                          <th className="text-left py-4 px-6 text-white font-semibold text-base whitespace-nowrap min-w-[120px]">
                            Metric
                          </th>
                          <th className="text-left py-4 px-6 text-white font-semibold text-base whitespace-nowrap min-w-[150px]">
                            Seller Rating
                          </th>
                          <th className="text-left py-4 px-6 text-white font-semibold text-base whitespace-nowrap min-w-[180px]">
                            Action
                          </th>
                        </tr>
                      </thead>
                    </table>
                  </div>
                </div>

                {/* Scrollable Body with Dynamic Height */}
                <div 
                  className="flex-1 overflow-auto scrollbar-hide"
                  ref={bodyRef}
                  style={{
                    maxHeight: `${tableHeight}px`,
                    scrollBehavior: 'smooth',
                  }}
                  onScroll={(e) => {
                    if (headerRef.current) {
                      headerRef.current.scrollLeft = e.target.scrollLeft;
                    }
                  }}
                >
                  <table className="w-full">
                    <tbody className="bg-neutral-900">
                      {tableData.map((row, index) => (
                        <tr 
                          key={row.id} 
                          className={`
                            border-b border-gray-800 last:border-b-0 
                            hover:bg-gray-800/30 transition-colors duration-150
                            ${index % 2 === 0 ? 'bg-neutral-900/50' : 'bg-neutral-900'}
                          `}
                        >
                          {/* Row Number Column */}
                          <td className="py-4 px-6 whitespace-nowrap min-w-[px]">
                            <span className="text-gray-400 font-normal text-xs">
                              {index + 1}.
                            </span>
                          </td>

                          {/* Seller Column */}
                          <td className="py-4 whitespace-nowrap text-sm !font-[400] min-w-[200px]">
                            <div className="flex items-center gap-3">
                              <img
                                src={row.seller.image}
                                alt={row.seller.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0 shadow-md"
                                loading="lazy"
                              />
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-white font-medium truncate max-w-[120px]">
                                  {row.seller.name}
                                </span>
                                {row.seller.verified && (
                               <img src={badge} alt='soctral badge' className=""/>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Items Column */}
                          <td className="py-4 px-6 whitespace-nowrap text-sm !font-[400] min-w-[250px]">
                            <div className="flex items-center gap-3">
                              <img
                                src={row.item.image}
                                alt={row.item.name}
                                className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow-md"
                                loading="lazy"
                              />
                              <span className="text-white font-medium truncate max-w-[160px]">
                                {row.item.name}
                              </span>
                            </div>
                          </td>

                          {/* Metric Column */}
                          <td className="py-4 px-6 whitespace-nowrap text-sm !font-[400] min-w-[120px]">
                            <div className="flex items-center gap-1 text-white">
                              <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
                                Followers
                              </div>
                              <div className="flex items-center pb-[5px] font-semibold text-xs mt-1">
                                {row.followers.toLocaleString()}
                              </div>
                            </div>
                          </td>

                          {/* Seller Rating Column */}
                          <td className="py-4 px-6 whitespace-nowrap text-sm !font-[400] min-w-[150px]">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5 flex-shrink-0">
                                {renderStars(row.rating)}
                              </div>
                            </div>
                          </td>


                          {/* Action Column */}
                          <td className="py-4  whitespace-nowrap text-sm !font-[400] min-w-[180px]">
                            <div className="flex items-center gap-2">
                              <button 
                                className="py-[12px] px-[30px] font-medium bg-primary hover:bg-primary text-xs text-white rounded-full transition-all duration-200 flex-shrink-0 hover:shadow-lg transform hover:scale-105"
                                aria-label="View item"
                              >
                                Initiate Trade
                              </button>
                              <button 
                                className="py-[12px] px-[30px] font-medium bg-[#2c2a2f] rounded-full text-xs transition-all duration-200 flex-shrink-0 hover:shadow-lg transform hover:scale-105"
                                aria-label="Add to favorites"
                              >
                                View Account Metrics
                              </button>
                
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Professional Scroll Indicators */}
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 pointer-events-none">
                  <div className="bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
                    Scroll to view more
                  </div>
                </div>
              </div>
            </section>

</main>


        </div>
      </div>
    </>
  );
};

export default HomePage;