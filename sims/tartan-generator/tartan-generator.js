// MacQuarrie Clan Tartan Pattern with adjustable horizontal stripe opacity
// We are trying to generate this pattern:
// https://en.wikipedia.org/wiki/Clan_MacQuarrie#/media/File:MacQuarrie_tartan_(J._Grant).png
let redBackground = [230, 45, 55];
let greenBand = [50, 130, 50];
let pattern = [
  { color: greenBand, width: 30 },
  { color: redBackground, width: 12 },
  { color: greenBand, width: 2 },
  { color: redBackground, width: 3 },
  { color: greenBand, width: 2 },
  { color: redBackground, width: 36 },
  { color: greenBand, width: 2 },
  { color: redBackground, width: 3 },
  { color: greenBand, width: 2 },
  { color: redBackground, width: 12 },
];

let patternWidth = 0;
let patternSlider;
let opacitySlider;
let patternCount = 3;
let horizontalOpacity = 180;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Calculate total pattern width
  patternWidth = pattern.reduce((sum, stripe) => sum + stripe.width, 0);
  
  // Create pattern count slider
  patternSlider = createSlider(1, 10, 3, 1);
  patternSlider.position(20, 20);
  patternSlider.size(200);
  
  // Create opacity slider
  opacitySlider = createSlider(0, 255, 180, 1);
  opacitySlider.position(20, 60);
  opacitySlider.size(200);
}

function draw() {
  background(redBackground);
  
  // Get current values from sliders
  patternCount = patternSlider.value();
  horizontalOpacity = opacitySlider.value();
  
  // Calculate scaled pattern width to fit the number of repeats
  let scaleFactor = min(width / (patternWidth * patternCount), height / (patternWidth * patternCount));
  let scaledWidth = patternWidth * scaleFactor;
  
  // Draw vertical stripes
  let x = 0;
  while (x < width + scaledWidth) {
    for (let stripe of pattern) {
      fill(stripe.color);
      noStroke();
      rect(x, 0, stripe.width * scaleFactor, height);
      x += stripe.width * scaleFactor;
    }
  }
  
  // Draw horizontal stripes with multiply blend and adjustable opacity
  blendMode(MULTIPLY);
  let y = 0;
  while (y < height + scaledWidth) {
    for (let stripe of pattern) {
      fill(stripe.color[0], stripe.color[1], stripe.color[2], horizontalOpacity);
      noStroke();
      rect(0, y, width, stripe.width * scaleFactor);
      y += stripe.width * scaleFactor;
    }
  }
  
  // Reset blend mode
  blendMode(BLEND);
  
  // Draw slider labels with background
  fill(255, 255, 255, 200);
  noStroke();
  rect(15, 12, 380, 30, 5);
  rect(15, 52, 380, 30, 5);
  
  fill(0);
  textAlign(LEFT, CENTER);
  textSize(14);
  textStyle(NORMAL);
  text(`Pattern Repeats: ${patternCount}`, 230, 27);
  text(`Horizontal Opacity: ${horizontalOpacity}`, 230, 67);
  
  // Draw centered text with shadow
  textAlign(CENTER, CENTER);
  textSize(min(width / 15, 48));
  textStyle(BOLD);
  
  // Text shadow
  fill(0, 0, 0, 200);
  text('MacQuarrie Clan\nTartan Pattern', width / 2 + 2, height / 2 + 2);
  
  // Main text
  fill(255, 255, 255);
  text('MacQuarrie Clan\nTartan Pattern', width / 2, height / 2);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  redraw();
}