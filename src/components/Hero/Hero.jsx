import React, {useState, useEffect} from 'react';
import {Container} from 'react-bootstrap';
import {init, clearCanvas} from '../Canvas/Canvas';
import axios from 'axios';
import Chatbox from '../Chatbox/Chatbox';
import {delay, getIndex, RGBtoGray, createGroups, shuffle} from '../Utils/Utils';
import {fireConfetti} from '../Utils/confetti';
import stampSrc from "../Imgs/stamp.png";
import Buttons from "../Canvas/Buttons"
import backgroundMusic from "../Sounds/BackgroundMusic.mp3"
import confettiPop from "../Sounds/confettiGun.mp3"
import click from "../Sounds/click.wav"

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
  const [isSmallMobile, setIsSmallMobile] = useState(false);
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
  var clearButton = '';
  var skipButton = '';

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

  const audio = new Audio(backgroundMusic);
  audio.loop = true;
  audio.volume = 0.5;
  const confettiSound = new Audio(confettiPop);
  const clickSound = new Audio(click);
  var speaker = '';

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
  var mute = false;

  // Function to be executed on loading of screen
  function inits() {
    clearButton = document.getElementById("clear");
    skipButton = document.getElementById("skip");
    skipButton.onclick = skip;

    speaker = document.getElementById("speaker");
    speaker.addEventListener('click', muteMusic);
  };

  // Function for stopping music
  function muteMusic() {
    if (mute) {
      audio.play();
      mute = false;
      speaker.className= "fa-solid fa-volume-high fa-3x";
    } else {
      audio.pause();
      audio.currentTime = 0; 
      mute = true;
      speaker.className= "fa-solid fa-volume-xmark fa-3x"
    }     
  };

  // Add event listeners
  window.addEventListener('load', inits)

  useEffect(() => {
    if (window.innerWidth > 769) {
      setIsDesktop(true);
      setIsMobile(false);
    } else {
      setIsMobile(true);
      setIsDesktop(false);
      if (window.innerHeight < 700) {
        setIsSmallMobile(true);
      }
    }
  }, []);

  function givePrompt(reset="false") {
    clickSound.play()
    if (!mute) {
      audio.play();
    };
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
    } else {
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
    clickSound.play()
    // Initializes drawing screen and canvas, and starts countdown and predictions
    const context = srcCanvas.getContext('2d');

    dropdown.className = "dropup";
    delay(2000).then(() => dropdown.style.display = "none");
    if (isDesktop) {
      srcCanvas.style.display = "flex";
      chatbox.style.display = "flex";
    } else {
      srcCanvas.style.display = "inline-block";
      chatbox.style.display = "inline-block";
    }
    
    clearButton.style.visibility = "visible";
    skipButton.style.visibility = "visible";
    context.fillStyle = "white";
    context.fillRect(0, 0, srcCanvas.width, srcCanvas.height);

    timer.style.visibility = "visible";
    if (isDesktop) {
      init(18);
    } else {
      init(10);
    }
    // Start possibility for drawing
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
        } else {
          givePrompt();
        };
        resetChatbox();
        clearCanvas();
      } else {
        // Code for countdown timer look
        if (seconds < 10) {
          document.getElementById("timeRemaining").innerHTML = "0:0" + seconds;
        } else {
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
    if (isDesktop) {
      destContext.scale(0.0555555, 0.0555555); // Scale data down to correct size for model.
    } else {
      destContext.scale(0.1, 0.1); // Scale data down to correct size for model.
    }
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
          if (!mute) {
            confettiSound.play();
          }
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
            } else {
              // Continue the round
              givePrompt();
            }
            resetChatbox();
            clearCanvas();
          }, 3000);
        } else {
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
    clickSound.play()

    const message = document.getElementById("message");
    if (correctNr === 0) {
      message.innerHTML = "Better luck next time";
    } else if (correctNr === 1) {
      message.innerHTML = "Well done";
    } else if (correctNr === 2) {
      message.innerHTML = "Great stuff!";
    } else {
      message.innerHTML = "Amazing, you are a true artist";
    }

    finalScore.innerHTML = "Our neural network figured out " + correctNr + " of your " + finAmount + " drawings"; // Input final score

    finalDropdown.className = "dropdown";
    finalDropdown.style.display = "flex";
    getPrompt.style.display = "none";
  };

  function skip() {
    // Function to stop the current drawing and skip to the next
    clickSound.play()

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
      } else {
        givePrompt();
      };
      resetChatbox();
      clearCanvas();

    });
  };

  let canvas, chatBox, canvStyle, finalcanvas1, finalcanvas2, finalcanvas3, br, buttonDivMob, buttonDiv, resultsPadding, margins1, margins2; // Do something if smaller than 280 or if low height
  if (isDesktop) {
    canvas = <canvas id="Canvas" width="504" height="504" style={{cursor: "url(../Imgs/pencil.png), auto", border: "2px solid black", display: "none"}}></canvas>;
    chatBox = <Chatbox style={{display: "none", flex: "1", height: "504px"}}/>;
    canvStyle = {display: "flex", alignItems: "center"};
    finalcanvas1 = <canvas id="drawing1" width="252" height="252" style={{paddingLeft: "10px", paddingRight: "10px"}}></canvas>;
    finalcanvas2 = <canvas id="drawing2" width="252" height="252" style={{paddingLeft: "10px", paddingRight: "10px"}}></canvas>;
    finalcanvas3 = <canvas id="drawing3" width="252" height="252" style={{paddingLeft: "10px", paddingRight: "10px"}}></canvas>;
    br = '';
    buttonDivMob = '';
    buttonDiv = <Buttons />;
    resultsPadding = {paddingBottom: "20px"};
    margins1 = {fontSize: "2em"};
    margins2 = {color: "black"};
  } else {
    canvas = <canvas id="Canvas" width="280" height="280" style={{cursor: "url(../Imgs/pencil.png), auto", border: "2px solid black", display: "none", marginTop: "10vh", marginBottom: "20px"}}></canvas>;
    chatBox = <Chatbox style={{display: "none", height: "40vh"}}/>;
    canvStyle = {display: "inline-block", justifyContent: "center", alignItems: "center", textAlign:"center"};
    finalcanvas1 = <canvas id="drawing1" width="140" height="140" style={{paddingTop: "10px", paddingBottom: "10px"}}></canvas>;
    finalcanvas2 = <canvas id="drawing2" width="140" height="140" style={{paddingTop: "10px", paddingBottom: "10px"}}></canvas>;
    finalcanvas3 = <canvas id="drawing3" width="140" height="140" style={{paddingTop: "10px", paddingBottom: "10px"}}></canvas>;
    br = <br></br>;
    buttonDivMob = <Buttons />;
    buttonDiv = '';
    if (isSmallMobile) {
      resultsPadding = {paddingBottom: "10px"};
      margins1 = {fontSize: "2em", margin: "0px"};
      margins2 = {margin: "0px"};
    } else {
      resultsPadding = {paddingBottom: "20px"};
      margins1 = {fontSize: "2em"};
      margins2 = {color: "black"};
    }
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
          <h1 id="message" style={margins1}> Well done! </h1>
          <p style={margins2} id="finalScore"></p>
          <div>
            {finalcanvas1}
            {br}
            {finalcanvas2}
            {br}
            {finalcanvas3}
          </div>
          <div id="results" style={resultsPadding}>
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
        <div id = "mainScreen" style={{flexDirection: "column", alignItems: "center",  display: "flex"}}>
          <div id = "canv-chat" style={canvStyle}>
            {canvas}
            {buttonDivMob}
            {chatBox}
          </div>
          {buttonDiv}
          <button id="getPrompt" className="cta-btn cta-btn--hero" onClick={givePrompt}>
          Start drawing
          </button>
        </div>
      </Container>
    </section>
  );
};

export default Hero;