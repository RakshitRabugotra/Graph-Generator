// To prevent default behavior on right-mouse-button click
document.addEventListener('contextmenu', event => event.preventDefault());

/*
Contains definition for Graph and Circle
*/

class Circle {
  /*
  Class to represent circles in the code
  */
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.isHighlighted = false;
  }

  setCenter(x, y) {
    this.x = x;
    this.y = y;
  }

  getLeftCorner() {
    return [this.x - this.radius / 2, this.y - this.radius / 2];
  }

  getRightCorner() {
    return [this.x + this.radius / 2, this.y + this.radius / 2];
  }

  getCenter() {
    return [this.x, this.y];
  }

  pointCollides(x, y) {
    return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.radius, 2);
  }

  isPointWithin(x, y, length) {
    return Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) <= Math.pow(this.radius + length, 2);
  }

  getDistance(other) {
    if (!(other instanceof Object.getPrototypeOf(this))) {
      return;
    }

    return math.pow(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2), 0.5);
  }

}


/*
The size of canvas
*/
let WIDTH = 600;
let HEIGHT = 600;


/*
  Color specifications  
*/


/*
To store the circles and edges
*/
let circleList = [];
let edgeList = [];
let shortestPath = null;
const vertexRadius = 5; 


/*
  Util functions
*/

/**
 * Returns the sum of object's attribute
 * @param {*} object The object containing some attribute
 * @param {string} attribute The attribute to sum (in string)
 * @returns 
 */
const sum = (object, attribute) => {

  let _sum = object[0][attribute];
  
  for(let i = 1; i < object.length; i++) {
    _sum = _sum + object[i][attribute];
  }

  return _sum;
}


/*
Functions for different modes
*/

/**
 * Create a vertex on the canvas
 * @param {int} x The x coordinate of vertex
 * @param {int} y The y coordinate of vertex
 */
const createVertex = (x, y) => {

  // Check if we've clicked on other circle
  for(let circle of circleList) {
    if(circle.isPointWithin(x, y, circle.radius)) {
      return;
    }
  }

  // Check if we've clicked near the boundary
  if(x < vertexRadius || x > WIDTH - vertexRadius) return;
  if(y < vertexRadius || y > HEIGHT - vertexRadius) return;

  // Else create a circle on that point
  circleList.push( new Circle(x, y, vertexRadius) );
}

/**
 * Appends an edge to the edgeList
 * @param {*} x The x coordinate of vertex
 * @param {*} y The y coordinate of vertex
 * @returns 
 */
const createEdge = (currentCircle) => {

  // Check if two circles are highlighted
  if(sum(circleList, "isHighlighted") === 2) {
    // Make both the circles un-highlighted
    edgeList[edgeList.length - 1][0].isHighlighted = false;
    currentCircle.isHighlighted = false;

    // Don't create the edge if it already exists
    for(let edge of edgeList) {

      // Check if the edge A to B exists
      if(edge[0] === edgeList[edgeList.length-1][0] && edge[1] === currentCircle) {
        edgeList.pop();
        return;
      }

      // Check if the edge B to A exists
      if(edge[0] === currentCircle && edge[1] === edgeList[edgeList.length-1][0]) {
        edgeList.pop();
        return;
      }
    }

    // Create an edge by adding the circle to last edge
    edgeList[edgeList.length - 1][1] = currentCircle;
  } else {
    // Append an empty edge
    edgeList.push( [currentCircle, null] );
  }

}


/**
 * Deletes a vertex from the canvas
 */
const deleteVertex = (currentCircle) => {

  // Delete all the edges associated with it
  edgeList = edgeList.filter(edge => {
    return edge[0] !== currentCircle && edge[1] !== currentCircle;
  })

  // Remove the vertex like this
  circleList = circleList.filter(circle => {
    return circle != currentCircle;
  });
}


/**
 * Find the shortest path between the two vertices
 */
const findPath = () => {

  // Fetch the two vertices
  console.log("SUM:" + sum(circleList, "isHighlighted"));

}


/*
P5 rendering functionality begins
*/
let currentMode = 0;

MODES = {
  0: (x, y) => { return createVertex(x, y); },
  1: (x, y) => { return createEdge(x, y); },
  2: (x, y) => { return deleteVertex(x, y); },
  // 3: function() { return }
}


function preload() {
  bgImage = loadImage("static/example1.png");
}

function setup() {
  WIDTH = bgImage.width/4;
  HEIGHT = bgImage.height/4;
  console.log(bgImage.width, bgImage.height);
  createCanvas(WIDTH, HEIGHT);


  // Create a button to switch modes
  button = createButton("Switch mode");
  button.mouseClicked(() => {
    currentMode++;
    if(currentMode > Object.keys(MODES).length) currentMode = 0;
    console.log(currentMode);
  });

  // Create another button to save progress
  saveButton = createButton("Save Progress");
  saveButton.mouseClicked(() => {
    // Create objects and save them in a JSON file
    const saveObject = {
        "circleList": circleList,
        "edgeList": edgeList
    }
    console.log(saveObject);
  })
}

function draw() {
  background(0);

  // Draw the image
  image(bgImage, 0, 0, WIDTH, HEIGHT);

  // Draw the circle
  stroke(0);
  fill(0);
  for(let c of circleList) {
    // If the circle is highlighted then paint it red
    if(c.isHighlighted) fill(255, 0, 0);
    else fill(0);

    circle(c.x, c.y, c.radius*2);
  }

  // Draw the edges
  stroke(0, 0, 255);
  for(let edge of edgeList) {
    if(edge[1] === null) continue;

    // Draw a line
    line(edge[0].x, edge[0].y, edge[1].x, edge[1].y);
  }
}

function mousePressed(event) {
  // If we're clicking outside the canvas then don't do anything
  if(mouseX > WIDTH || mouseX < 0) return false;
  if(mouseY > HEIGHT || mouseY < 0) return false;

  // Check if the user right clicked
  let isRightClick = (event.button === 2);

  let x = mouseX;
  let y = mouseY;
  
  // Check if we're clicking on a circle
  let circleClicked = null;
  for(let circle of circleList) {
    if(circle.pointCollides(x, y)) {
      circleClicked = circle;
      break;
    }
  }

  // If we didn't click on any circle then create a circle
  if(circleClicked === null && !isRightClick) {
    createVertex(x, y);
    return;
  }

  // Check if one circle is already highlighted and the user clicked with right muse button
  if(sum(circleList, "isHighlighted") === 1 && isRightClick) {
    findPath();
    return;
  }

  // Else highlight the circle
  if(!circleClicked.isHighlighted) {
    circleClicked.isHighlighted = true;
  } else {
    // If the circle was already highlighted, then delete it
    deleteVertex(circleClicked);
    return;
  }


  // Then create an edge
  createEdge(circleClicked);

  return false;
}