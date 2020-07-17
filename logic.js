let grains = []
function setup() {
  createCanvas(320, 100);
  pixelDensity(1);
  background(100);
  // frameRate(5)
}

function draw() {

  if (grains.length > 0) {
    console.log(grains.length)
    let grain = grains.shift()
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
    if ((pixels[pixelBelow + 1] == 255) && (pixels[pixelBelowAndLeft + 1] == 255) && (pixels[pixelBelowAndRight + 1] == 255)) {
      return
    }
    // moves pixel down if space below is empty
    if (shouldPixelMove(pixelBelow)) {
      movePixelDown(off, pixelBelow, x, y, d)
    } else if (!(shouldPixelMove(pixelBelow)) && shouldPixelMove(pixelBelowAndLeft)) {
      movePixelDown(off, pixelBelowAndLeft, x, y, d)
    } else if ((!shouldPixelMove(pixelBelow) && !shouldPixelMove(pixelBelowAndLeft))) {
      movePixelDown(off, pixelBelowAndRight, x, y, d)
    }
  }
}

/**
 * 
 * @param {Event} e the mouse press event
 */
function mousePressed(e) {
  loadPixels();
  // console.log(e);
  let x = e.x;
  // console.log(x)
  let y = e.y;

  // console.log(y)
  let d = pixelDensity();
  let off = (y * width + x) * d * 4;
  placePixel(off);
  let pixelBelow = off + width * 4
  grains.push([off, pixelBelow, x, y, d])
  // returns true or false
  return false;
}

/**
 * 
 * @param {Number} off the beginning of the 4 digit pixel RGBA value
 */
function placePixel(off) {
  loadPixels();
  // turn from background Grey to Green
  pixels[off + 1] = 255;
  updatePixels();
}

/**
 * 
 * @param {Number} pixelBelow the position of the pixel below the current pixel
 * @returns {Boolean} whether or not the pixel can move to the space below
 */

function shouldPixelMove(pixel) {
  // if this is true, the pixel below is empty
  loadPixels()
  return pixels[pixel + 1] == 100
}

/**
 * 
 * @param {Number} off the beginning of the 4 digit pixel RGBA value
 * @param {Number} pixelBelow the beginning of the 4 digit pixel RGBA value below the off 
 * @param {Number} y the row of the next row below
 * @param {Number} d the pixel density
 */

function movePixelDown(currentPixel, nextPixel, x, y, d) {
  // empties current pixel
  pixels[currentPixel + 1] = 100
  updatePixels();
  // occupies next pixel
  pixels[nextPixel + 1] = 255
  updatePixels();

  // get x, y, d of nextPixel and run it through equation again starting from shouldPixelMove
  let nextRow = y + 1
  let nextNextPixel = nextPixel + width * 4
  // console.log(nextPixelBelow)

  grains.push([nextPixel, nextNextPixel, x, nextRow, d])
}