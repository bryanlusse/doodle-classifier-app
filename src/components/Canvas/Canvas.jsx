let coord = { x: 0, y: 0 };

export function init() {
// Function to initialize the event listeners that make drawing 
// on the canvas possible.
    const canvas = document.getElementById("Canvas");
    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mouseup", stop);
}

function reposition(event) {
// Function to update current coordinates.
    const canvas = document.getElementById("Canvas");
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;
};

function start(event) {
// Function to initialize the event listener for drawing and 
// uodate the mouse coordinates when drawing starts.
    document.addEventListener("mousemove", draw);
    reposition(event);
};

function stop() {
// Function to remove the event listener for drawing as the drawing 
// motion has stopped.
    document.removeEventListener("mousemove", draw);
};

function draw(event) {
// Function to draw on the canvas. 
    const canvas = document.getElementById("Canvas");
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = 18;
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