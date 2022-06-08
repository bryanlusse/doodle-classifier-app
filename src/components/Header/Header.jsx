import React from 'react';
import Image from "../Imgs/DOODLE_CLASSIFIER-logo.png";
import CountDownTimer from "../Utils/countdown"

const Header = () => {

  return (
    <div className="header_navbar">
        <div id="logo" className="nav-child" style={{width: "20%", marginLeft: "20px"}}>
          <a href="./">
              <img className="logo" src={Image} alt="Doodle Classifier"/>
          </a>
        </div>
        <CountDownTimer/>
    </div>
  );
};

export default Header;
