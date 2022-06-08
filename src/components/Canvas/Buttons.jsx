import React from 'react';
import {clearCanvas} from "./Canvas"

const Buttons = () => {

  return (
    <div style={{width: "100vw"}}>
        <button className="button btn erase" id="clear" style={{visibility: "hidden", margin: "10px"}} onClick={clearCanvas}>
            <i className="fa-solid fa-eraser"></i>
        </button>
        <button className="button btn skip" id="skip" style={{visibility: "hidden", margin: "10px"}}>
            <i className="fa-solid fa-arrow-right"></i>
        </button>
    </div>
  );
};

export default Buttons;