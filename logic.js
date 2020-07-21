let grains = []
function setup() {
  createCanvas(320, 100);
  pixelDensity(1);
  background(100);
  frameRate(30)
}

function draw() {

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
      if ((pixels[pixelBelow + 1] == 255) && (pixels[pixelBelowAndLeft + 1] == 255) && (pixels[pixelBelowAndRight + 1] == 255)) {
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
 * @param {Event} e the mouse press event
 */
function mouseDragged(e) {

  loadPixels();
  let x = e.x
  let y = e.y;
  let d = pixelDensity();
  let off = (y * width + x) * d * 4;
  placePixel(off);


  let pixelBelow = off + width * 4
  grains.push([off, pixelBelow, x, y, d])
}

/**
 * 
 * @param {Number} off the beginning of the 4 digit pixel RGBA value
 */
function placePixel(off) {
  // loadPixels();
  // turn from background Grey to Green
  pixels[off + 1] = 255;
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
  return pixels[pixel + 1] == 100
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
  pixels[currentPixel + 1] = 100
  // updatePixels();
  // occupies next pixel
  pixels[nextPixel + 1] = 255

  // get x, y, d of nextPixel and run it through equation again starting from shouldPixelMove
  let nextRow = y + 1
  let nextNextPixel = nextPixel + width * 4
  // console.log(nextPixelBelow)
  return [nextPixel, nextNextPixel, x, nextRow, d]
}