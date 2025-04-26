import logo from "../assets/soctraLogo.png"
import Card from "../components/OnboardingDesktopCard"
import one from "../assets/1.svg";
import two from "../assets/2.svg";
import three from "../assets/3.svg";
import { Link } from "react-router-dom";


export default function DesktopOnboardingSteps() {
    return (
<>
<div className="max-w-screen-2xl mx-auto bg-tertiary p-[2.6rem]">
     <div className="flex items-center justify-center mb-[1.7rem]">
<div className="flex justify-between items-start w-full ">
    
    <img src={logo} alt="" className="w-[50px] h-[50px]" />

    <p className="text-white cursor-pointer font-normal">Skip</p>
</div>

      </div>

      <div className="w-[408px]">
        <h1 className="text-white font-bold text-4xl mb-[.7rem]">Welcome to Soctral</h1>
        <p className="text-xs leading-6 text-white">A Secure Marketplace for Buying and Selling Social Media Accounts, Built on Trust and Transparency.</p>
      </div>

      <div className="flex w-full justify-between gap-4 mt-8">
          {/* Multiple Card components */}
          <Card
            imageSrc={one}
            altText="Image 1"
            text="Buy and Sell Social Media Accounts Without The Fear of Scam"
          />
          <Card
            imageSrc={two}
            altText="Image 2"
            text="Your Payments Are Safely Held Until Satisfaction Is Guaranteed."
          />
          <Card
            imageSrc={three}
            altText="Image 3"
            text="Connect and Trade Directly with Sellers and Buyers."
          />
        </div>

<div className="flex justify-center w-full mx-auto items-center mt-[4rem]">

  <button className="h-[64px] w-[30%] bg-primary text-white rounded-full text-sm font-semibold">
    <Link>
    Get Started
    </Link>
  </button>
</div>


        </div>
</>
 
    );
  }
  