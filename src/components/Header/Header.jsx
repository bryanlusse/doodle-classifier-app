import React from 'react';
import Image from "../Imgs/DOODLE_CLASSIFIER-logo.png";
import CountDownTimer from "../Utils/countdown"

let remainingPathColor = "green";

const Header = () => {

  return (
    <div className="header_navbar">
        <div id="logo" className="nav-child" style={{width: "20%"}}>
          <a href="./">
              <img className="logo" src={Image} alt="Doodle Classifier"/>
          </a>
        </div>
        <CountDownTimer/>
        {/* <div className="nav-child" style={{width: "20%", height: "100%", marginBottom: "1%"}}>
        <label className="switch" >
            <input id="switch" type="checkbox" onClick={darkMode}/>
            <span className="slider round"></span>
            <div className="icons">
            <SunIcon />
            <MoonIcon />
            </div>
        </label>
        </div> */}
    </div>
  );
};

export default Header;
