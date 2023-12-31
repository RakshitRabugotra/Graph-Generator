/*
P5 rendering functionality begins
*/
const backgroundImageFile = "./static/example1.png";
const scaleFactor = 4;

function preload() {
  bgImage = loadImage(backgroundImageFile);
}

function setup() {
  WIDTH = bgImage.width / scaleFactor;
  HEIGHT = bgImage.height / scaleFactor;
  createCanvas(WIDTH, HEIGHT);
}

function draw() {
  background(0);
  strokeWeight(1);

  // Draw the image
  image(bgImage, 0, 0, WIDTH, HEIGHT);

  // Draw the circle
  if (!HIDE_ALL) {
    stroke(0);
    fill(0);
    for (let c of circleList) {
      // If the circle is unnamed and we aren't supposed to show them, then skip
      if (c.name === null && HIDE_UNNAMED_NODES) continue;

      // If the circle is highlighted then paint it red
      if (c.isHighlighted) fill(255, 0, 0);
      else fill(0);

      circle(c.x, c.y, c.radius * 2);
    }
  }

  if (!HIDE_EDGES && !HIDE_ALL) {
    // Draw the edges
    stroke(0, 0, 255);
    for (let edge of edgeList) {
      if (edge[1] === null) continue;

      // Draw a line
      line(edge[0].x, edge[0].y, edge[1].x, edge[1].y);
    }
  }

  // Draw the path
  if (shortestPath === null) return;

  stroke(0, 255, 0);
  strokeWeight(vertexRadius * 0.85);
  for (let i = 0; i < shortestPath.length - 1; i++) {
    // Draw a line
    line(
      shortestPath[i].x,
      shortestPath[i].y,
      shortestPath[i + 1].x,
      shortestPath[i + 1].y
    );
  }
}

function mousePressed(event) {
  // If we're clicking outside the canvas then don't do anything
  if (mouseX > WIDTH || mouseX < 0) return;
  if (mouseY > HEIGHT || mouseY < 0) return;

  // Check if the user right clicked
  let isRightClick = event.button === 2;

  let x = mouseX;
  let y = mouseY;

  // Check if we're clicking on a circle
  let circleClicked = null;
  for (let circle of circleList) {
    if (circle.pointCollides(x, y)) {
      circleClicked = circle;
      break;
    }
  }

  // If we didn't click on any circle then create a circle
  if (circleClicked === null && !isRightClick) {
    createVertex(x, y);
    return;
  }

  // Check if one circle is already highlighted and the user clicked with right muse button
  if (sum(circleList, "isHighlighted") === 1 && isRightClick) {
    findPath(circleClicked);
    return;
  }

  // Else highlight the circle
  if (!circleClicked.isHighlighted) {
    // Highlight the circle
    circleClicked.isHighlighted = true;
    // And load the circle's name to the text input
    vertexNameTextInput.value =
      circleClicked.name === null ? "null" : circleClicked.name;
  } else {
    // If the circle was already highlighted, then delete it
    deleteVertex(circleClicked);
    return;
  }

  // Check if there are two circles highlighted, then un-highlight the other one
  if (sum(circleList, "isHighlighted") === 2 && NODE_NAMING_MODE) {
    for (let circle of circleList) {
      if (!circle.isHighlighted) continue;
      if (circle.isEqual(circleClicked)) continue;
      // Else un-highlight the circle
      circle.isHighlighted = false;
    }
  }

  // If we're not in naming mode, then draw an edge
  if (NODE_NAMING_MODE) return;

  // Then create an edge
  createEdge(circleClicked);

  return false;
}
