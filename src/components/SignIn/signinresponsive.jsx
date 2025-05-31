// components/SignInResponsive.jsx
import React from 'react';
import ResponsiveWrapper from './ResponsiveWrapper';
import SignInMobile from './SignInMobile';
import SignInDesktop from './SignInDesktop';

const SignInResponsive = (props) => {
  return (
    <ResponsiveWrapper
      mobileComponent={SignInMobile}
      desktopComponent={SignInDesktop}
      {...props}
    />
  );
};

export default SignInResponsive;