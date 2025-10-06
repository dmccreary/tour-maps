// Scotland Route Map MicroSim
// Canvas dimensions
let canvasWidth = 600;
let drawHeight = 700;
let controlHeight = 150;
let canvasHeight = drawHeight + controlHeight;
let margin = 20;
let defaultTextSize = 16;

// Global variables for responsive design
let containerWidth; // calculated by container upon resize
let containerHeight = canvasHeight; // fixed height on page

// Map boundaries for Scotland
const MAP_BOUNDS = {
  minLat: 54.5,
  maxLat: 59.0,
  minLon: -8.0,
  maxLon: -1.5
};

// Map alignment parameters - adjust these to fine-tune coordinate positioning
let mapLatOffset = 0.05;    // Offset latitude (positive = shift north)
let mapLonOffset = -0.33;    // Offset longitude (positive = shift east)
let mapLatScale = 1.85;   // Scale latitude (>1 = stretch vertically)
let mapLonScale = 1.2;   // Scale longitude (>1 = stretch horizontally)

// Hotel locations with dates
const hotels = [
  { name: "Ibis", date: "9/22/2025", lat: 55.948399, lon: -3.186841 },
  { name: "Norton House Hotel & Spa", date: "9/23/2025", lat: 55.932422, lon: -3.384189 },
  { name: "Creggans Inn", date: "9/24/2025", lat: 56.175403, lon: -5.083672 },
  { name: "Clan MacDuff Hotel", date: "9/25/2025", lat: 56.795479, lon: -5.140878 },
  { name: "Eilean Iarmain Hotel", date: "9/26/2025", lat: 57.145349, lon: -5.799012 },
  { name: "Eilean Iarmain Hotel", date: "9/27/2025", lat: 57.145349, lon: -5.799012 },
  { name: "Coul House Hotel", date: "9/28/2025", lat: 57.571843, lon: -4.572125 },
  { name: "Coul House Hotel", date: "9/29/2025", lat: 57.571843, lon: -4.572125 },
  { name: "Dunkeld House Hotel", date: "9/30/2025", lat: 56.564644, lon: -3.610856 },
  { name: "The Waterfront", date: "10/1/2025", lat: 56.2227, lon: -2.6994 },
  { name: "Woodside Hotel", date: "10/2/2025", lat: 56.189625, lon: -4.055882 },
  { name: "Ibis", date: "10/3/2025", lat: 55.948399, lon: -3.186841 }
];

// UI Controls
let showLabelsCheckbox;
let showDatesCheckbox;
let currentHover = -1;

// Sliders for map alignment
let latOffsetSlider;
let lonOffsetSlider;
let latScaleSlider;
let lonScaleSlider;

// Map offset and scale
let mapOffsetX = margin;
let mapOffsetY = margin + 40;
let mapWidth;
let mapHeight;

// Map image
let mapImg;

function setup() {
  // Create a canvas to match the parent container's size
  updateCanvasSize();
  const canvas = createCanvas(containerWidth, containerHeight);
  canvas.parent(document.querySelector('main'));
  textSize(defaultTextSize);
  
  // Calculate map dimensions
  updateMapDimensions();
  
  // Load map image from local file
  mapImg = loadImage('map2.png');
  
  // Create checkboxes
  showLabelsCheckbox = createCheckbox('Show Hotel Names', true);
  showLabelsCheckbox.position(margin, drawHeight + 20);
  
  showDatesCheckbox = createCheckbox('Show Dates', false);
  showDatesCheckbox.position(margin, drawHeight + 45);
  
  // Create alignment sliders
  latOffsetSlider = createSlider(-2, 2, mapLatOffset, 0.01);
  latOffsetSlider.position(180, drawHeight + 75);
  latOffsetSlider.size(150);
  
  lonOffsetSlider = createSlider(-2, 2, mapLonOffset, 0.01);
  lonOffsetSlider.position(180, drawHeight + 100);
  lonOffsetSlider.size(150);
  
  // upper right
  latScaleSlider = createSlider(0.5, 3, mapLatScale, 0.05);
  latScaleSlider.position(500, drawHeight + 75);
  latScaleSlider.size(150);
  
  lonScaleSlider = createSlider(0.5, 3, mapLonScale, 0.05);
  lonScaleSlider.position(500, drawHeight + 100);
  lonScaleSlider.size(150);
  
  describe('Interactive map of Scotland showing a travel route through various hotels with arrows connecting the locations in sequence.', LABEL);
}

function draw() {
  // Draw area
  fill('aliceblue');
  stroke('silver');
  strokeWeight(1);
  rect(0, 0, canvasWidth, drawHeight);
  
  // Controls area
  fill('white');
  stroke('silver');
  strokeWeight(1);
  rect(0, drawHeight, canvasWidth, controlHeight);
  
  // Update map alignment parameters from sliders
  mapLatOffset = latOffsetSlider.value();
  mapLonOffset = lonOffsetSlider.value();
  mapLatScale = latScaleSlider.value();
  mapLonScale = lonScaleSlider.value();
  
  // Title
  fill('black');
  noStroke();
  textSize(20);
  textAlign(CENTER, TOP);
  text("Scotland Travel Route - September/October 2025", canvasWidth/2, 10);
  
  // Draw map background
  drawMapBackground();
  
  // Draw route arrows
  drawRoute();
  
  // Draw hotel markers
  drawHotels();
  
  // Draw hover information
  if (currentHover >= 0) {
    drawHoverInfo();
  }
  
  // Draw control labels
  drawControlLabels();
}

function updateMapDimensions() {
  mapWidth = canvasWidth - 2 * margin;
  mapHeight = drawHeight - margin - 60;
}

function drawMapBackground() {
  push();
  
  // Draw background rectangle
  fill(235, 245, 250);
  noStroke();
  rect(mapOffsetX, mapOffsetY, mapWidth, mapHeight);
  
  // Draw the map image if loaded
  if (mapImg && mapImg.width > 0) {
    // Apply low opacity for subtle background
    // make the second number lower for a lighter map
    tint(255, 140); // 180/255 = ~70% opacity
    image(mapImg, mapOffsetX, mapOffsetY, mapWidth, mapHeight);
    noTint();
  }
  
  // Add subtle border
  noFill();
  stroke(150, 160, 165);
  strokeWeight(2);
  rect(mapOffsetX, mapOffsetY, mapWidth, mapHeight);
  
  pop();
}

function latLonToXY(lat, lon) {
  // Apply offset first
  let offsetLat = lat + mapLatOffset;
  let offsetLon = lon + mapLonOffset;
  
  // Calculate center of the map bounds
  let centerLat = (MAP_BOUNDS.minLat + MAP_BOUNDS.maxLat) / 2;
  let centerLon = (MAP_BOUNDS.minLon + MAP_BOUNDS.maxLon) / 2;
  
  // Apply scale relative to center
  let scaledLat = centerLat + (offsetLat - centerLat) * mapLatScale;
  let scaledLon = centerLon + (offsetLon - centerLon) * mapLonScale;
  
  // Convert latitude/longitude to canvas coordinates
  let x = map(scaledLon, MAP_BOUNDS.minLon, MAP_BOUNDS.maxLon, 
              mapOffsetX, mapOffsetX + mapWidth);
  let y = map(scaledLat, MAP_BOUNDS.minLat, MAP_BOUNDS.maxLat, 
              mapOffsetY + mapHeight, mapOffsetY);
  return { x, y };
}

function drawRoute() {
  // Draw arrows connecting consecutive hotels
  stroke(50, 100, 200);
  strokeWeight(3);
  
  for (let i = 0; i < hotels.length - 1; i++) {
    let start = latLonToXY(hotels[i].lat, hotels[i].lon);
    let next = latLonToXY(hotels[i + 1].lat, hotels[i + 1].lon);
    
    // Skip if same location (consecutive nights at same hotel)
    if (dist(start.x, start.y, next.x, next.y) < 2) {
      continue;
    }
    
    // Draw arrow
    drawArrow(start.x, start.y, next.x, next.y);
  }
}

function drawArrow(x1, y1, x2, y2) {
  // Draw line
  line(x1, y1, x2, y2);
  
  // Calculate arrow head
  let angle = atan2(y2 - y1, x2 - x1);
  let arrowSize = 10;
  
  push();
  translate(x2, y2);
  rotate(angle);
  fill(50, 100, 200);
  noStroke();
  triangle(0, 0, -arrowSize * 1.5, -arrowSize * 0.6, -arrowSize * 1.5, arrowSize * 0.6);
  pop();
}

function drawHotels() {
  // Draw markers for each hotel
  let showLabels = showLabelsCheckbox.checked();
  let showDates = showDatesCheckbox.checked();
  
  for (let i = 0; i < hotels.length; i++) {
    let pos = latLonToXY(hotels[i].lat, hotels[i].lon);
    
    // Check if mouse is hovering
    let isHovered = dist(mouseX, mouseY, pos.x, pos.y) < 10;
    if (isHovered) {
      currentHover = i;
    }
    
    // Draw marker
    if (i === 0 || i === hotels.length - 1) {
      // Start and end points in green
      fill(50, 200, 50);
      stroke(30, 150, 0);
    } else {
      // Intermediate points in orange
      fill(200, 150, 0);
      stroke(150, 70, 0);
    }
    
    if (isHovered) {
      strokeWeight(4);
    } else {
      strokeWeight(2);
    }
    
    circle(pos.x, pos.y, 12);
    
    // Draw label if enabled
    if (showLabels) {
      
      // light gray background
      fill(240, 240, 240, 150);
      noStroke();
      rect(pos.x-50, pos.y-25, 120, 20);
      fill('black');
      noStroke();
      textSize(14);
      textAlign(CENTER, BOTTOM);
      text(hotels[i].name, pos.x, pos.y - 10);
    }
    
    // Draw date if enabled
    if (showDates) {
      fill(0);
      noStroke();
      textSize(14);
      textAlign(CENTER, TOP);
      text(hotels[i].date, pos.x, pos.y + 8);
    }
  }
}

function drawHoverInfo() {
  // Draw info box for hovered hotel
  let hotel = hotels[currentHover];
  let infoText = `${hotel.name}\n${hotel.date}\nLat: ${hotel.lat.toFixed(4)}, Lon: ${hotel.lon.toFixed(4)}`;
  
  // Calculate box dimensions
  textSize(14);
  let boxWidth = 250;
  let boxHeight = 70;
  let boxX = mouseX + 15;
  let boxY = mouseY - 35;
  
  // Keep box within canvas bounds
  if (boxX + boxWidth > canvasWidth - margin) {
    boxX = mouseX - boxWidth - 15;
  }
  if (boxY < margin) {
    boxY = margin;
  }
  if (boxY + boxHeight > drawHeight - margin) {
    boxY = drawHeight - margin - boxHeight;
  }
  
  // Draw box
  fill(255, 255, 220);
  stroke(100);
  strokeWeight(2);
  rect(boxX, boxY, boxWidth, boxHeight);
  
  // Draw text
  fill(0);
  noStroke();
  textAlign(LEFT, TOP);
  text(infoText, boxX + 10, boxY + 10);
}

function mouseMoved() {
  // Reset hover state
  currentHover = -1;
}

function drawControlLabels() {
  fill('black');
  noStroke();
  textSize(12);
  textAlign(LEFT, CENTER);
  
  text('Vert Lat Offset: ' + mapLatOffset.toFixed(2), margin, drawHeight + 85);
  text('Horiz Long Offset: ' + mapLonOffset.toFixed(2), margin, drawHeight + 110);
  text('Vert Lat Scale: ' + mapLatScale.toFixed(2), 360, drawHeight + 85);
  text('Horz Long Scale: ' + mapLonScale.toFixed(2), 360, drawHeight + 110);
}

function windowResized() {
  // Update canvas size when the container resizes
  updateCanvasSize();
  resizeCanvas(containerWidth, containerHeight);
  updateMapDimensions();
  
  // Reposition checkboxes
  showLabelsCheckbox.position(margin, drawHeight + 20);
  showDatesCheckbox.position(margin, drawHeight + 45);
  
  // Reposition sliders
  latOffsetSlider.position(180, drawHeight + 75);
  lonOffsetSlider.position(180, drawHeight + 100);
  latScaleSlider.position(500, drawHeight + 75);
  lonScaleSlider.position(500, drawHeight + 100);
  
  redraw();
}

function updateCanvasSize() {
  // Get the exact dimensions of the container
  const container = document.querySelector('main').getBoundingClientRect();
  containerWidth = Math.floor(container.width);
  canvasWidth = containerWidth;
}