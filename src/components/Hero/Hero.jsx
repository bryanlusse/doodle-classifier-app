import React, {useState, useEffect} from 'react';
// import {keepTheme, setTheme} from '../../utils/themes';
import {Container} from 'react-bootstrap';
import {init, clearCanvas} from '../Canvas/Canvas';
import axios from 'axios';
import Chatbox from '../Chatbox/Chatbox';
import {delay, argMax, RGBtoGray, createGroups, shuffle} from '../Utils/Utils';
import {fireConfetti} from '../Utils/confetti';

const classNames = ['banana',
  'calculator',
  'cat',
  'fish',
  'hamburger',
  'headphones',
  'house',
  'house plant',
  'mushroom',
  'windmill'];

var shuffledClassNames = shuffle(classNames);

const Hero = () => {
  const [isDesktop, setIsDesktop] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const getPrompt = document.getElementById('getPrompt');
  const chatbox = document.getElementById('chatbox');
  const dropdown = document.getElementsByClassName('dropdown')[0];
  const finalDropdown = document.getElementById('finalDropdown');
  const showPrompt = document.getElementById("showPrompt");
  const progress = document.getElementById("progress");
  const srcCanvas = document.getElementById('Canvas');
  const newCanvas = document.createElement("canvas");
  const timer = document.getElementById('countdownTimer');
  const finalScore = document.getElementById("finalScore");
  const clearButton = document.getElementById("clear");
  const skipButton = document.getElementById("skip");

  const fincan1 = document.getElementById("drawing1");
  const fincan2 = document.getElementById("drawing2");
  const fincan3 = document.getElementById("drawing3");
  const fincan = [fincan1, fincan2, fincan3];

  const resultdiv1 = document.getElementById("result1div");
  const resultdiv2 = document.getElementById("result2div");
  const resultdiv3 = document.getElementById("result3div");
  const resultdivs = [resultdiv1, resultdiv2, resultdiv3];

  const result1 = document.getElementById("result1");
  const result2 = document.getElementById("result2");
  const result3 = document.getElementById("result3");
  const results = [result1, result2, result3];

  const finAmount = 3;
  var reset = "false";
  var mode = "";
  newCanvas.width = 504;
  newCanvas.height = 504;
  var rndPrompt = '';
  var intervalId = null;
  var countdownId = null;
  var doodleNr = 0;
  var correctNr = 0;
  var gameNr = 0;

  // useEffect(() => {
  //   keepTheme();
  // })

  useEffect(() => {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
    }
  }, []);

  function givePrompt(reset="false") {
    if (reset === "true") {
      doodleNr = 0;
      correctNr = 0;
      gameNr += 1;
      shuffledClassNames = shuffle(shuffledClassNames);
      finalDropdown.className = "dropup";
      delay(2000).then(() => finalDropdown.style.display = "none");
      delay(2000).then(() => dropdown.style.display = "flex");
    }
    else {
      dropdown.style.display = "flex";
    };

    var currPrompt = shuffledClassNames[doodleNr]; // Get prompt to be drawn
    rndPrompt = currPrompt;
    showPrompt.innerHTML = currPrompt;
    progress.innerHTML = "Drawing " + (doodleNr+1).toString() + '/3';
    dropdown.className = "dropdown";
    getPrompt.style.display = "none";
  }

  function startDrawing() {
    const context = srcCanvas.getContext('2d');

    dropdown.className = "dropup";
    delay(2000).then(() => dropdown.style.display = "none");
    srcCanvas.style.display = "flex";
    clearButton.style.visibility = "visible";
    skipButton.style.visibility = "visible";
    chatbox.style.display = "flex";
    context.fillStyle = "white";
    context.fillRect(0, 0, srcCanvas.width, srcCanvas.height);

    timer.style.visibility = "visible";
    init() // Start possibility for drawing
    var isGuessing = window.setInterval(function(){
      prediction();
    }, 5000); // Predict class of drawing every 5 seconds
    intervalId = isGuessing;
    var countDownDate = new Date(Date.now() + 22000);
    var countdown = window.setInterval(function(){
      var now = new Date().getTime();
      var distance = countDownDate - now;
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (distance < 0) {
        clearInterval(countdown);
        clearInterval(intervalId);
        resetTimer();

        saveDrawing(mode="xmark");

        doodleNr += 1;
        if (doodleNr===finAmount) {
          giveFinalScreen();
        }
        else {
          givePrompt();
        };
        resetChatbox();
        clearCanvas();
      }
      else {
        if (seconds < 10) {
          document.getElementById("timeRemaining").innerHTML = "0:0" + seconds;
        }
        else {
          document.getElementById("timeRemaining").innerHTML = "0:" + seconds;
        };
        
        var timeFraction = seconds / 20;
        var circleDashArray = Math.round(timeFraction * 283);
        document.getElementById("base-timer-path-remaining").style.strokeDasharray = circleDashArray.toString() + " 283";

        if (seconds <= 5) { // Red-colored timer
          document.getElementById("base-timer-path-remaining").classList.remove("orange");
          document.getElementById("base-timer-path-remaining").classList.add("red");        
        }
        if (seconds <= 10 & seconds > 5) { // Orange-colored timer
          document.getElementById("base-timer-path-remaining").classList.remove("green");
          document.getElementById("base-timer-path-remaining").classList.add("orange");    
        }
      };
    }, 1000); // Update timer every second
    countdownId = countdown;
  }

  const prediction = async(e) => {
    var destCanvas = document.createElement("canvas");
    destCanvas.width = 504;
    destCanvas.height = 504;
    var destContext = destCanvas.getContext('2d');
    var srcContext = srcCanvas.getContext('2d');

    var imageData = srcContext.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
    
    newCanvas.getContext("2d").putImageData(imageData, 0, 0); // newCanvas gets updated
    destContext.scale(0.0555555, 0.0555555);
    destContext.drawImage(newCanvas, 0, 0); // But destContext doesn't update

    var scaledImg = destContext.getImageData(0, 0, 28, 28).data;
    var gray = RGBtoGray(scaledImg);
    var result = createGroups(createGroups(gray, 784), 28);

    destCanvas.remove()

    if (gray.reduce((partialSum, a) => partialSum + a, 0) !== (255*28*28)) { // Check if drawing has started
      axios({
        method: 'post',
        url: 'https://us-central1-doodle-classifier-350707.cloudfunctions.net/doodle-prediction',
        data: {
          model_path: "projects/doodle-classifier-350707/models/doodle_classifier",
          instances: [result]
        },
        config: {
          headers: {'Access-Control-Allow-Origin': '*'}
        }
      })
      .then((response) => {
        var predictions = response.data.prediction[0]
        var score = [];
        for (let i = 0; i < predictions.length; i++) {
          score.push(Math.tanh(predictions[i]));
        }

        const bubble = document.createElement('div');
        const incoming = document.getElementsByClassName("incoming")[0];
        bubble.className = "bubble";

        if (classNames[argMax(score)]===rndPrompt) {
          bubble.innerHTML = "Oh, I know. This is a " + classNames[argMax(score)];
          incoming.appendChild(bubble);
          fireConfetti();
          clearInterval(intervalId);
          clearInterval(countdownId);
          resetTimer();

          // Save drawing
          saveDrawing(mode="check");

          doodleNr += 1;
          correctNr += 1;
          setTimeout(() => {
            if (doodleNr===3) {
              giveFinalScreen();
              // More stuff for after finishing
            }
            else {
              givePrompt();
            }
            resetChatbox();
            clearCanvas();
          }, 3000);
        }
        else {
          bubble.innerHTML = "Is it a " + classNames[argMax(score)] + "?";
          incoming.appendChild(bubble);
        };
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  function resetTimer() {
    document.getElementById("base-timer-path-remaining").classList.remove("red");
    document.getElementById("base-timer-path-remaining").classList.remove("orange");
    document.getElementById("base-timer-path-remaining").classList.add("green");   
    document.getElementById("base-timer-path-remaining").style.strokeDasharray = "283";
    document.getElementById("timeRemaining").innerHTML = "0:20";
  };

  function resetChatbox() {
    const bubbleInit = document.createElement('div');
    const incoming = document.getElementsByClassName("incoming")[0];
    bubbleInit.className = "bubble";
    bubbleInit.innerHTML = "Hey, I'm going to guess what you are drawing"
    incoming.replaceChildren(...[bubbleInit])
  };

  function saveDrawing(mode) {
    var can = fincan[doodleNr];
    if (gameNr===0) {
      can.getContext('2d').scale(0.5, 0.5);
    }
    can.getContext('2d').drawImage(srcCanvas, 0, 0);

    var result = results[doodleNr];
    result.className = "fa-solid fa-" + mode
    result.innerHTML = " " + rndPrompt;

    var resultdiv = resultdivs[doodleNr];
    resultdiv.classList.add(mode);
  };

  function giveFinalScreen() {
    finalScore.innerHTML = "Our neural network figured out " + correctNr + " of your " + finAmount + " drawings"; // Input final score

    finalDropdown.className = "dropdown";
    finalDropdown.style.display = "flex";
    getPrompt.style.display = "none";
  };

  return (
    <section id="Hero" style={{height: "100vh"}}>
      <Container style={{display: "flex", height: "100vh", justifyContent: "center", alignItems: "center"}}>
        <div className="dropdown" style={{display: "none", flexDirection: "column"}}>
          <h1 id = "progress" style={{fontSize: "1.5em", fontWeight: "lighter"}}></h1>
          <h1 style={{fontSize: "2em"}}> You need to draw </h1>
          <div id="showPrompt" style={{margin: "20px", marginBottom: "80px", fontSize: "5em"}}></div>
          <button id="draw" className="cta-btn cta-btn--hero-black" onClick={startDrawing}>
            Got it
          </button>
        </div>
        <div id='finalDropdown' className="dropdown" style={{display: "none", flexDirection: "column"}}>
          <h1 style={{fontSize: "2em"}}> Well done! </h1>
          <p id="finalScore"></p>
          <div>
            <canvas id="drawing1" width="252" height="252" style={{paddingLeft: "10px", paddingRight: "10px"}}></canvas>
            <canvas id="drawing2" width="252" height="252" style={{paddingLeft: "10px", paddingRight: "10px"}}></canvas>
            <canvas id="drawing3" width="252" height="252" style={{paddingLeft: "10px", paddingRight: "10px"}}></canvas>
          </div>
          <div id="results" style={{paddingBottom: "20px"}}>
            <div id="result1div" className="one" >
              <i id="result1"></i>
            </div>
            <div id="result2div" className="two">
              <i id="result2"></i>
            </div>
            <div id="result3div" className="three">
              <i id="result3"></i>
            </div>
          </div>
          <button id='playAgain' className="cta-btn cta-btn--hero-black" onClick={() => givePrompt(reset='true')}>
            Play again  
          </button>
        </div>
        <canvas id="Canvas" width="504" height="504" style={{cursor: "url(../Imgs/pencil.png), auto", border: "2px solid black", display: "none"}}></canvas>
        <Chatbox />
        <button id="getPrompt" className="cta-btn cta-btn--hero" onClick={givePrompt}>
          Start drawing
        </button>
      </Container>
      <button className="button btn erase" id="clear" style={{visibility: "hidden", top: "-140px", left: "-300px"}} onClick={clearCanvas}>
        <i className="fa-solid fa-eraser"></i>
      </button>
      <button className="button btn skip" id="skip" style={{visibility: "hidden", top: "-140px", left: "-280px"}}>
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </section>
  );
};


export default Hero;