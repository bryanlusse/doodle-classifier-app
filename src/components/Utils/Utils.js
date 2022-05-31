export function delay(time) {
// Function to delay the output of the next line of code by a 'time'
// amount of miliseconds.
  return new Promise(resolve => setTimeout(resolve, time));
};

export function randomIntFromInterval(min, max) {
// Function to retrieve a random integer from a predefined interval, 
// defined by 'min' and 'max'.
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export function argMax(array) {
// Function to retrieve the index of the maximal value of 'array'. 
  return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
};

export function RGBtoGray(pixels) {
// Function to transform RGBA pixel information into Grayscale pixel information. 
// The lightness is calculated using the values for Red, Green and Blue.
  var grayPixels = [];
  for (var i = 0; i < pixels.length; i += 4) {

    let lightness = parseInt((pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3);

    grayPixels.push(lightness);
  };
  return grayPixels
};

export function createGroups(arr, numGroups) {
// Function to change the structure of arrays. It takes array 'arr' and
// groups the elements in 'numGroups' groups. 
//
// Example:
// array = [1,2,3,4,5,6,7,8,9];
// createGroups(array, 3);
// Output:   [[1,2,3],
//           [4,5,6],
//           [7,8,9]];
  const perGroup = Math.ceil(arr.length / numGroups);
  return new Array(numGroups)
    .fill('')
    .map((_, i) => arr.slice(i * perGroup, (i + 1) * perGroup));
};

export function shuffle(originalArray) {
  var array = [].concat(originalArray);
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}