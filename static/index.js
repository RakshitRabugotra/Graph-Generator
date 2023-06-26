// To prevent default behavior on right-mouse-button click
document.addEventListener("contextmenu", (event) => event.preventDefault());

// Fetch the input field for the vertex-name
const vertexNameTextInput = document.getElementById("vertexName");

// To show the directions on the indx page
const directionParagraph = document.getElementById("direction-para");

/*
The size of canvas
*/
let WIDTH = 600;
let HEIGHT = 600;

const unicodeArrowRight = "\u2192";

/*
To store the circles and edges
*/
let circleList = [];
let edgeList = [];

let shortestPath = null;
const vertexRadius = 5;

// To hide edges, nodes or both
let HIDE_ALL = false;
let HIDE_EDGES = false;
let HIDE_UNNAMED_NODES = false;

// To name the nodes
let NODE_NAMING_MODE = false;

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

  for (let i = 1; i < object.length; i++) {
    _sum = _sum + object[i][attribute];
  }

  return _sum;
};

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
  for (let circle of circleList) {
    if (circle.isPointWithin(x, y, circle.radius)) {
      return;
    }
  }

  // Check if we've clicked near the boundary
  if (x < vertexRadius || x > WIDTH - vertexRadius) return;
  if (y < vertexRadius || y > HEIGHT - vertexRadius) return;

  // Else create a circle on that point
  circleList.push(new Circle(x, y, vertexRadius));
};

/**
 * Appends an edge to the edgeList
 * @param {*} x The x coordinate of vertex
 * @param {*} y The y coordinate of vertex
 * @returns
 */
const createEdge = (currentCircle) => {
  // Check if two circles are highlighted
  if (sum(circleList, "isHighlighted") === 2) {
    // Make both the circles un-highlighted
    edgeList[edgeList.length - 1][0].isHighlighted = false;
    currentCircle.isHighlighted = false;

    // Don't create the edge if it already exists
    for (let edge of edgeList) {
      // Check if the edge A to B exists
      if (
        edge[0] === edgeList[edgeList.length - 1][0] &&
        edge[1] === currentCircle
      ) {
        edgeList.pop();
        return;
      }

      // Check if the edge B to A exists
      if (
        edge[0] === currentCircle &&
        edge[1] === edgeList[edgeList.length - 1][0]
      ) {
        edgeList.pop();
        return;
      }
    }

    // Create an edge by adding the circle to last edge
    edgeList[edgeList.length - 1][1] = currentCircle;
  } else {
    // Append an empty edge
    edgeList.push([currentCircle, null]);
  }
};

/**
 * Deletes a vertex from the canvas
 */
const deleteVertex = (currentCircle) => {
  // Delete all the edges associated with it
  edgeList = edgeList.filter((edge) => {
    return edge[0] !== currentCircle && edge[1] !== currentCircle;
  });

  // Remove the vertex like this
  circleList = circleList.filter((circle) => {
    return circle != currentCircle;
  });
};

/**
 * Find the shortest path between the two vertices
 */
const findPath = (lastCircle) => {
  // Fetch the two vertices
  // If there are more than 1 circle highlighted then there's something wrong
  if (sum(circleList, "isHighlighted") !== 1) return;

  // We need to remove the 'null' edge at the last of edgeList
  edgeList.splice(edgeList.length - 1, 1);

  let start = lastCircle;
  let goal = null;

  // Find the second circle
  for (let circle of circleList) {
    if (circle.isHighlighted) {
      circle.isHighlighted = false;
      goal = circle;
      break;
    }
  }

  const manhattanDistance = (vertex0, vertex1) =>
    Math.abs(vertex0.x - vertex1.x) + Math.abs(vertex0.y - vertex1.y);

  this.currentGraph = new Graph(circleList, edgeList);
  shortestPath = this.currentGraph.A_star(start, goal, manhattanDistance);

  // Then create a path string
  let pathString = shortestPath[shortestPath.length - 1].name;
  for (let i = shortestPath.length - 2; i >= 0; i--) {
    if (shortestPath[i].name === null) continue;

    pathString = `${pathString} ${unicodeArrowRight} ${shortestPath[i].name}`;
  }
  directionParagraph.innerHTML = pathString;
};

/**
 * Deletes all the edges and vertices
 */
const clearAll = () => {
  circleList = new Array();
  edgeList = new Array();
};

/**
 * To hide all the nodes and edges
 */
const toggleUnnamedNodes = () => (HIDE_UNNAMED_NODES = !HIDE_UNNAMED_NODES);
const toggleHideEdges = () => (HIDE_EDGES = !HIDE_EDGES);
const toggleHideAll = () => (HIDE_ALL = !HIDE_ALL);

const toggleNamingMode = () => {
  NODE_NAMING_MODE = !NODE_NAMING_MODE;
  console.log("NAMING NODES: " + NODE_NAMING_MODE);
};

/**
 * Gives the name to the vertex
 */
const giveNameToVertex = () => {
  // Fetch the highlighted circle
  circleHighlighted = null;

  let i = 0;
  for (; i < circleList.length; i++) {
    if (circleList[i].isHighlighted) {
      circleHighlighted = circleList[i];
      break;
    }
  }
  // If there are no circles highlighted then return
  if (circleHighlighted === null) return;

  // Make the circle un-highlighted
  circleHighlighted.isHighlighted = false;

  // Else assign the input field to the circle's name
  if (vertexNameTextInput.value === "") {
    circleHighlighted.name = null;
  } else {
    circleHighlighted.name = vertexNameTextInput.value;
  }

  // Remove the last extra edge created
  if (!NODE_NAMING_MODE) edgeList.pop();
};
