const saveProgress = () => {
  // Converting JSON data to string
  const object = {
    vertices: new Array(),
    edges: new Array(),
  };

  // If circleList is empty then don't save
  if (circleList.length === 0) return;

  // Add all the circles
  for (const circle of circleList) {
    object.vertices.push({
      x: circle.x,
      y: circle.y,
      radius: circle.radius,
      name: circle.name,
    });
  }
  // Add all the edges
  for (const edge of edgeList) {
    if (edge[1] === null) continue;

    object.edges.push([
      {
        x: edge[0].x,
        y: edge[0].y,
        radius: edge[0].radius,
        name: edge[0].name,
      },
      {
        x: edge[1].x,
        y: edge[1].y,
        radius: edge[1].radius,
        name: edge[1].name,
      },
    ]);
  }

  // Send the JSON to the backend using fetch API
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  };

  const fetchResult = fetch("save", options);
};

const loadProgress = () => {
  // Send a request to the backend
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const fetchResult = fetch("load", options);

  // After fetch is completed we can access the data
  fetchResult
    .then((result) => result.json())
    .then((jsonData) => {
      // Copy the data found to circle-list and edge-list
      jsonData["vertices"].forEach((vertex) => {
        circleList.push(
          new Circle(vertex.x, vertex.y, vertex.radius, vertex.name)
        );
      });
      jsonData["edges"].forEach((edge) => {
        const circle1 = edge[0];
        const circle2 = edge[1];

        edgeList.push(new Array(null, null));

        circleList.forEach((circle) => {
          if (circle.isEqual(circle1))
            edgeList[edgeList.length - 1][0] = circle;
          if (circle.isEqual(circle2))
            edgeList[edgeList.length - 1][1] = circle;
        });
      });
    });
};
