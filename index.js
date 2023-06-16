class Circle {

    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius

        this.isHighlighted = false
    }

    setCenter(x, y) {
        this.x = x
        this.y = y
    }

    getLeftCorner() {
        return (this.x - this.radius / 2, this.y - this.radius / 2);
    }

    getRightCorner() {
        return (this.x + this.radius / 2, this.y + this.radius / 2);
    }

    getCenter() {
        return [this.x, this.y];
    }

    pointCollides(x, y) {
        return (x - this.x) ** 2 + (y - this.y) ** 2 <= this.radius ** 2;
    }

    isPointWithin(x, y, length) {
        return (x - this.x) ** 2 + (y - this.y) ** 2 <= (this.radius + length) ** 2;
    }

}


class Graph {

    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
    }

}


const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// drawer.fillStyle = "#FF0000";
// drawer.fillRect(0, 0, 150, 75);

const vertexRadius = 20;

const circleList = [];
const edgeList = [];



function createCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#003300';
    ctx.stroke();
}

function deleteCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius + 5, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.fillStyle = '#ffffff';
    ctx.fill();
}

function highlightCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ff0000';
    ctx.stroke();
}

function createEdge(circle) {

    // If the user didn't click on any circle, then do nothing
    if(circle === null) return

    // If the list is empty then add an edge
    if(edgeList.length === 0) edgeList.push( [circle, null] );

    if (edgeList[edgeList.length-1][1] === null) {
            
        edgeList[edgeList.length-1][1] = circle;

        // set line stroke and line width
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;

        const [circle1, circle2] = edgeList[edgeList.length-1];

        // draw a red line
        ctx.beginPath();
        ctx.moveTo(circle1.x, circle1.y);
        ctx.lineTo(circle2.x, circle2.y);
        ctx.stroke();


        console.log(edgeList);
    }
    // If one circle is highlighted
    else {
        // Append an empty list to store the circles later
        edgeList.push( [circle, null] )    
    }
}


function createVertex(x, y) {
    // Check if we're clicking inside other circle

    for (let i = 0; i < circleList.length; i++) {
        
        // The element at this position
        const circle = circleList[i];

        if (circle.pointCollides(x, y)) {
            // Highlight this circle
            // highlightCircle(circle);
            createEdge(circle);
            return;
        }
    }

    // Check if we're clicking in a region where circle goes partially out of bounds
    if (x < vertexRadius || x > canvas.width - vertexRadius) return;
    if (y < vertexRadius || y > canvas.height - vertexRadius) return;

    circleList.push(new Circle(x, y, vertexRadius));
    createCircle(circleList[circleList.length - 1]);
}


function deleteVertex(offsetX, offsetY) {
    for (let circle of circleList) {
        if (circle.isPointWithin(offsetX, offsetY, circle.radius)) {
            deleteCircle(circle);
        }
    }
}


function handleClick(e, wasRightClicked) {
    const { offsetX, offsetY } = e;
    if (wasRightClicked) deleteVertex(offsetX, offsetY)
    else createVertex(offsetX, offsetY);
}

canvas.onclick = (e) => handleClick(e, false);
canvas.oncontextmenu = (e) => {
    e.preventDefault(); // to prevent the context menu from appearing
    handleClick(e, true)
};
