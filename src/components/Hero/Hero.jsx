import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {init, clearCanvas} from '../Canvas/Canvas';
import axios from 'axios';
import Chatbox from '../Chatbox/Chatbox';
import {delay, getIndex, RGBtoGray, createGroups, shuffle} from '../Utils/Utils';
import {fireConfetti} from '../Utils/confetti';
import stampSrc from "../Imgs/stamp.png";

const classNames = ['an apple',
                    'a banana',
                    'a basketball',
                    'a cake',
                    'a calculator',
                    'a cat',
                    'a chair',
                    'a computer',
                    'a cookie',
                    'a crab',
                    'an eye',
                    'a fish',
                    'a flower',
                    'a hamburger',
                    'a hat',
                    'a pair of headphones',
                    'a hockey stick',
                    'an hourglass',
                    'a house',
                    'a house plant',
                    'a mushroom',
                    'a palm tree',
                    'a pizza',
                    'a potato',
                    'a rainbow',
                    'a spider',
                    'a sword',
                    'a syringe',
                    'a t-shirt',
                    'a windmill'];

var shuffledClassNames = shuffle(classNames);

const Hero = () => {
  // Inits for objects
  // eslint-disable-next-line no-unused-vars
  const [isDesktop, setIsDesktop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [isMobile, setIsMobile] = useState(false);
  const getPrompt = document.getElementById('getPrompt');
  const chatbox = document.getElementById('chatbox');
  const dropdown = document.getElementById('dropdown');
  const finalDropdown = document.getElementById('finalDropdown');
  const showPrompt = document.getElementById("showPrompt");
  const progress = document.getElementById("progress");
  const srcCanvas = document.getElementById('Canvas');
  const newCanvas = document.createElement("canvas");
  newCanvas.width = 504;
  newCanvas.height = 504;
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

  // inits for variables
  const finAmount = 3;
  // eslint-disable-next-line no-unused-vars
  var reset = "false";
  // eslint-disable-next-line no-unused-vars
  var mode = "";
  var rndPrompt = '';
  var intervalId = null;
  var countdownId = null;
  var doodleNr = 0;
  var correctNr = 0;
  var gameNr = 0;
  var prevGuess = '';

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
    // Get the random drawing prompt and serve it to the user in the dropdown
    if (reset === "true") {
      // Reset all variables when player chooses to start a new game
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
    // Initializes drawing screen and canvas, and starts countdown and predictions
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
        // When time runs out, reset everything and give next prompt
        clearInterval(countdown);
        clearInterval(intervalId);
        resetTimer();

        saveDrawing(mode="xmark");

        doodleNr += 1;
        prevGuess = '';
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
        // Code for countdown timer look
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
    // Retrieve drawing from canvas and send it to the AI model to make a prediction. 
    // Fetch prediction and check if prediction is correct
    var destCanvas = document.createElement("canvas");
    destCanvas.width = 504;
    destCanvas.height = 504;
    var destContext = destCanvas.getContext('2d');
    var srcContext = srcCanvas.getContext('2d');

    var imageData = srcContext.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
    
    newCanvas.getContext("2d").putImageData(imageData, 0, 0); 
    destContext.scale(0.0555555, 0.0555555); // Scale data down to correct size for model.
    destContext.drawImage(newCanvas, 0, 0); 
    
    var scaledImg = destContext.getImageData(0, 0, 28, 28).data;
    var gray = RGBtoGray(scaledImg);
    var result = createGroups(createGroups(gray, 784), 28);

    destCanvas.remove()

    if (gray.reduce((partialSum, a) => partialSum + a, 0) !== (255*28*28)) { // Check if drawing has started
      axios({
        method: 'post',
        url: 'URL',
        data: {
          model_path: "projects/doodle-classifier-350707/models/doodle_classifier/versions/V2",
          instances: [result]
        },
        config: {
          headers: {'Access-Control-Allow-Origin': '*'}
        }
      })
      .then((response) => {
        // Retrieve predictions
        var predictions = response.data.prediction[0];
        var score = [];
        for (let i = 0; i < predictions.length; i++) {
          score.push(Math.tanh(predictions[i]));
        }

        const bubble = document.createElement('div');
        const incoming = document.getElementsByClassName("incoming")[0];
        bubble.className = "bubble";
        var currGuess = classNames[getIndex(score)];

        if (prevGuess===currGuess) {
          // Code to allow model to guess a different drawing if guess stays the same
          currGuess = classNames[getIndex(score, 'secondBiggest')]; 
        }

        if (currGuess===rndPrompt) {
          // When model guesses correctly
          bubble.innerHTML = "Oh, I know. This is " + currGuess;
          incoming.appendChild(bubble);

          fireConfetti();
          clearInterval(intervalId);
          clearInterval(countdownId);
          resetTimer();

          // Save drawing
          saveDrawing(mode="check");

          doodleNr += 1;
          correctNr += 1;
          prevGuess = '';
          setTimeout(() => {
            if (doodleNr===3) {
              // Round is over, show scores:
              giveFinalScreen();
            }
            else {
              // Continue the round
              givePrompt();
            }
            resetChatbox();
            clearCanvas();
          }, 3000);
        }
        else {
          // Wrong guess
          bubble.innerHTML = "Is it " + currGuess + "?";
          incoming.appendChild(bubble);
          prevGuess = currGuess;
        };
      })
      .catch((error) => {
        console.log(error);
      });
    }
  };

  function resetTimer() {
    // Reset colour and time on countdown timer
    document.getElementById("base-timer-path-remaining").classList.remove("red");
    document.getElementById("base-timer-path-remaining").classList.remove("orange");
    document.getElementById("base-timer-path-remaining").classList.add("green");   
    document.getElementById("base-timer-path-remaining").style.strokeDasharray = "283";
    document.getElementById("timeRemaining").innerHTML = "0:20";
  };

  function resetChatbox() {
    // Clears guesses from model and reinitializes the first message
    const bubbleInit = document.createElement('div');
    const incoming = document.getElementsByClassName("incoming")[0];
    bubbleInit.className = "bubble";
    bubbleInit.innerHTML = "Hey, I'm going to guess what you are drawing"
    incoming.replaceChildren(...[bubbleInit])
  };

  function saveDrawing(mode) {
    // Save drawing in canvas to show at the end of the round
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
    // Give final screen with score overview and saved drawings
    finalScore.innerHTML = "Our neural network figured out " + correctNr + " of your " + finAmount + " drawings"; // Input final score

    finalDropdown.className = "dropdown";
    finalDropdown.style.display = "flex";
    getPrompt.style.display = "none";
  };

  function skip() {
    // Function to stop the current drawing and skip to the next
    clearInterval(countdownId);
    clearInterval(intervalId);
    resetTimer();

    var srcContext = srcCanvas.getContext('2d');
    var stamp = new Image();
    stamp.onload = function() {
      srcContext.drawImage(stamp, 0, 0, srcCanvas.width, srcCanvas.height);
    };
    stamp.src = stampSrc;

    delay(500).then(() => {
      saveDrawing(mode="xmark");

      doodleNr += 1;
      prevGuess = '';
      if (doodleNr===finAmount) {
        giveFinalScreen();
      }
      else {
        givePrompt();
      };
      resetChatbox();
      clearCanvas();

    });
  }

  return (
    <section id="Hero" style={{height: "100vh"}}>
      <Container style={{display: "flex", height: "100vh", justifyContent: "center", alignItems: "center"}}>
        <div id = "dropdown" className="dropdown" style={{display: "none", flexDirection: "column"}}>
          <h1 id = "progress" style={{fontSize: "1.5em", fontWeight: "lighter"}}>Placeholder</h1>
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
      <button className="button btn erase" id="clear" style={{visibility: "hidden", top: "-140px", left: "-240px"}} onClick={clearCanvas}>
        <i className="fa-solid fa-eraser"></i>
      </button>
      <button className="button btn skip" id="skip" style={{visibility: "hidden", top: "-140px", left: "-220px"}} onClick={skip}>
        <i className="fa-solid fa-arrow-right"></i>
      </button>
    </section>
  );
};


export default Hero;