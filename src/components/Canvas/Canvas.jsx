let coord = { x: 0, y: 0 };
let drawSize = 0;

export function init(size=18) {
// Function to initialize the event listeners that make drawing 
// on the canvas possible.
    const canvas = document.getElementById("Canvas");
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("touchstart", start);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("touchend", stop);
    drawSize = size;
};

function reposition(event) {
// Function to update current coordinates.
    const canvas = document.getElementById("Canvas");   
    if (event.type === 'touchstart' || event.type === 'touchmove'){
        coord.x = event.touches[0].clientX - canvas.offsetLeft;
        coord.y = event.touches[0].clientY - canvas.offsetTop;
    } 
    else if (event.type === 'mousemove' || event.type === 'mousedown'){
        coord.x = event.clientX - canvas.offsetLeft;
        coord.y = event.clientY - canvas.offsetTop;
    };
};

function start(event) {
// Function to initialize the event listener for drawing and 
// uodate the mouse coordinates when drawing starts.
    const canvas = document.getElementById("Canvas");
    reposition(event);
    if (event.target === canvas) {
        event.preventDefault();
    }
    document.addEventListener("mousemove", draw);
    document.addEventListener("touchmove", draw);
};

function stop(event) {
// Function to remove the event listener for drawing as the drawing 
// motion has stopped.
    const canvas = document.getElementById("Canvas");   
    if (event.target === canvas) {
        event.preventDefault();
    }
    document.removeEventListener("mousemove", draw);
    document.removeEventListener("touchmove", draw);
};

function draw(event) {
// Function to draw on the canvas. 
    const canvas = document.getElementById("Canvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = drawSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.moveTo(coord.x, coord.y);
    reposition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
};

export function clearCanvas() {
    // Function to clear the canvas. 
    const canvas = document.getElementById("Canvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
};
