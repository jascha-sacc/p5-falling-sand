/**
 * Original Code by dengel29
 * Extended by SpiralProgrammer to include:
 *    GUI to control
 *      Color
 *      Brush Size
 *      Sand Density
 */


var grains = [];

//Gui Variables
var myColor = [255,255,125];
var brushSize = 1;
var brushSizeMin = 1;
var brushSizeMax = 100;
var myName = "Your Name";

var gui;
var saveButton;



function setup() {
  
  createCanvas(1000,500);
  pixelDensity(1);
  background(100,100,100);
  
  gui = createGui('Sand Color Picker');
  gui.addGlobals('myColor');
  gui.addGlobals('myName');

  saveButton = createButton('Save Your Sketch');
  saveButton.position(width-150,25);
  saveButton.mousePressed(saveTheSketch)


  //draw a frame around the canvas
  noFill();
  strokeWeight(50);
  rect(0,0,width,height)

}

function draw() {

  //draw if the mouse is down
  if(mouseIsPressed === true){
    loadPixels();
    let x = mouseX;
    let y = mouseY;
    let d = pixelDensity();
    let off = (y * width + x) * d * 4;
     
    //place random pixels around the cetner of a circle at x,y with radius brush size

    // grains increase with brushSize for speed and fun!
    for (let i = 0; i < Math.floor(brushSize); i++) {

      let r = brushSize * sqrt(random());
      let theta = random() * 2 * PI;
      let newX = round(x + r * cos(theta));
      let newY = round(y + r * sin(theta));
      let newOff = (newY * width + newX) * d * 4;

      placePixel(newOff);
      let newPixelBelow = newOff + width * 4;
      grains.push([newOff, newPixelBelow, newX, newY, d]);
    }
  } 

  //check through each grain 
  if (grains.length > 0) {
    grains.forEach((grain, i) => {
      let pixelBelow = grain[1]
      let pixelBelowAndLeft = pixelBelow - 4
      let pixelBelowAndRight = pixelBelow + 4
      let x = grain[2]
      let y = grain[3]
      let d = grain[4]
      let off = grain[0]
      if (y == height - 1) {
        return
      }
      // keeps pixel where it is if all three pixels below are occuppied
      if (((pixels[pixelBelow] != 100) || (pixels[pixelBelow+1] !=100) || (pixels[pixelBelow+2] !=100)) 
        && ((pixels[pixelBelowAndLeft] != 100) || (pixels[pixelBelowAndLeft+1] !=100) || (pixels[pixelBelowAndLeft+2] !=100))
        && ((pixels[pixelBelowAndRight] != 100) || (pixels[pixelBelowAndRight+1] !=100) || (pixels[pixelBelowAndRight+2] !=100))) {
        return
      }
      // moves pixel down if space below is empty
      if (shouldPixelMove(pixelBelow)) {
        grains[i] = movePixelDown(off, pixelBelow, x, y, d)

      } else if (shouldPixelMove(pixelBelowAndLeft)) {
        grains[i] = movePixelDown(off, pixelBelowAndLeft, x, y, d)
      } else if (!shouldPixelMove(pixelBelowAndLeft)) {
        grains[i] = movePixelDown(off, pixelBelowAndRight, x, y, d)
      } else {
        grains.splice(i, 1)
      }
    })
  }
  updatePixels();
}

/**
 * Saves and exports the sketch as a png
 * 
 */
function saveTheSketch(){
  saveCanvas(myName+"'s picture",'png');
}




/**
 * 
 * @param {Number} off the beginning of the 4 digit pixel RGBA value
 */
function placePixel(off) {
  // loadPixels();
  // turn background the currently set color
  pixels[off] = red(myColor);
  pixels[off + 1] = green(myColor);
  pixels[off + 2] = blue(myColor);
  updatePixels();
}

/**
 * 
 * @param {event} Event sent to the function when mouse wheel is changed
 * changes the brush size when the mouse wheel is moved
 */

function mouseWheel(event) {
  console.log(brushSize)
  console.log("adjusting Brush");
  brushSize += event.delta / 100; //scales down the event because typical delta ~100
  if (brushSize < brushSizeMin) {
    brushSize = brushSizeMin;
  } else if (brushSize > brushSizeMax) {
    brushSize = brushSizeMax;
  }
  console.log(brushSize, "new Size")

  //uncomment to block page scrolling
  return false;
}

/**
 * 
 * @param {Number} pixel the position of the pixel below the current pixel
 * @returns {Boolean} whether or not the pixel can move to the space below
 */

function shouldPixelMove(pixel) {
  // if this is true, the pixel below is empty
  // loadPixels()
  return pixels[pixel] == 100 && pixels[pixel+1] == 100 && pixels[pixel+2] == 100
}

/**
 * 
 * @param {Number} currentPixel the beginning of the 4 digit pixel RGBA value
 * @param {Number} nextPixel the beginning of the 4 digit pixel RGBA value below the off 
 * @param {Number} y the row of the next row below
 * @param {Number} d the pixel density
 */

function movePixelDown(currentPixel, nextPixel, x, y, d) {
  // empties current pixel
  pixels[currentPixel] = 100
  pixels[currentPixel + 1] = 100
  pixels[currentPixel + 2] = 100
  // updatePixels();
  // occupies next pixel
  pixels[nextPixel] = red(myColor)
  pixels[nextPixel + 1] = green(myColor)
  pixels[nextPixel + 2] = blue(myColor)

  // get x, y, d of nextPixel and run it through equation again starting from shouldPixelMove
  let nextRow = y + 1
  let nextNextPixel = nextPixel + width * 4
  // console.log(nextPixelBelow)
  return [nextPixel, nextNextPixel, x, nextRow, d]
}
