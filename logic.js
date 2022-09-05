var grains = [];
var myColor = [255,255,125];
var brushSize = 1;
var brushSizeMin = 1;
var density = 1;
var densityMin = 1;
var densityMax = 10;
var gui;

function setup() {
  
  createCanvas(1000,500);
  pixelDensity(1);
  background(100,100,100);
  frameRate(30);
  gui = createGui('Sand GUI');
  gui.addGlobals('myColor','brushSize','density');


}

function draw() {
  if(mouseIsPressed === true){


    loadPixels();
    let x = mouseX;
    let y = mouseY;
    let d = pixelDensity();
    let off = (y * width + x) * d * 4;
     
    //place random pixels around the cetner of a circle at x,y with radius brush size
    for(let i = 0;i<density;i++){ 
      let r = brushSize * sqrt(random());
      let theta = random() * 2 * PI;
      let newX = round(x + r * cos(theta));
      let newY = round(y + r * sin(theta));
      let newOff = (newY*width + newX) * d * 4;
     
      placePixel(newOff);
      let newPixelBelow = newOff + width*4;
      grains.push([newOff,newPixelBelow,newX,newY,d]);
    }
    
  }


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