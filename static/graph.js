

/*
    Util functions
*/
const removeElement = (array, element) => {
    let i = Infinity;
    for(i = array.length-1; i >= 0; i--) {
        if(array[i] === element) break;
    }

    // The element is not found
    if(i === Infinity) return;

    // Else remove the element
    array.splice(i, 1);
}


/**
 * The class to handle graphs
 * @param {*} vertices The list of vertices
 * @param {*} edges The list of edges
 */
class Graph {

    constructor(vertices, edges) {
        this.vertices = vertices;
        this.edges = edges;
        this.neighbors = new Map();
        this.__parseNeighbors();
    }

    isNeighbor(v1, v2) {
        return self.neighbors[v1].includes(v2);
    }

    __parseNeighbors() {
        // Iterate over all the edges
        for(let edge of this.edges) {
            let [vertex0, vertex1] = edge;

            if(!this.neighbors.has(vertex0)) {
                this.neighbors.set(vertex0, new Array(vertex1));
            } else {
                this.neighbors.set(vertex0, this.neighbors.get(vertex0).concat(vertex1));
            }
        }

        for(let edge of this.edges) {
            let [vertex0, vertex1] = edge;

            if(!this.neighbors.has(vertex1)) {
                this.neighbors.set(vertex1, new Array(vertex0));
            } else {
                this.neighbors.set(vertex1, this.neighbors.get(vertex1).concat(vertex0));
            }
        }

        console.log(this.neighbors);
    }

    __reconstruct_path(cameFrom, current) {
        let totalPath = [current];
        while(cameFrom.has(current)) {
            current = cameFrom.get(current);
            totalPath = new Array(current).concat(totalPath);
        }
        return totalPath;
    }

    /**
     * Implementation of A* search algorithm
     * @param {*} start The start of the path
     * @param {*} goal To goal to reach
     * @param {*} heuristic The heuristic function to evaluate cost of each node
     */
    A_star(start, goal, heuristic) {

        // The function g(n) would be the weight of the edge
        const g = (thisVertex, nextVertex) => thisVertex.getDistance(nextVertex);

        // Function f(n) = g(n) + h(n)
        const f = (thisVertex, nextVertex) => g(thisVertex, nextVertex) + heuristic(thisVertex, nextVertex);

        // The set of discovered nodes that may need to be (re-)expanded.
        // Initially, only the start node is known.
        // This is usually implemented as a min-heap or priority queue rather than a hash-set.
        // openSet := {start}
        let openSet = new Array(start);

        // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from the start
        // to n currently known.
        // cameFrom := an empty map
        let cameFrom = new Map();

        // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
        // gScore := map with default value of Infinity
        // gScore[start] := 0
        let gScore = new Map();
        this.vertices.forEach((node) => gScore.set(node, Infinity));
        gScore.set(start, 0);

        // For node n, fScore[n] := gScore[n] + h(n). fScore[n] represents our current best guess as to
        // how cheap a path could be from start to finish if it goes through n.
        // fScore := map with default value of Infinity
        // fScore[start] := h(start)
        let fScore = new Map();
        this.vertices.forEach((node) => fScore.get(node, Infinity));
        fScore.set(start, heuristic(start, goal));


        // while openSet is not empty
        while(openSet.length > 0) {
            // This operation can occur in O(Log(N)) time if openSet is a min-heap or a priority queue
            // current := the node in openSet having the lowest fScore[] value
            let current = openSet[0];
            for(let i = 1; i < openSet.length; i++) {
                if(fScore.get(openSet[i]) <= fScore.get(current)) {
                    current = openSet[i];
                }
            }

            if(current === goal) return this.__reconstruct_path(cameFrom, current);

            // remove the current node from the openSet
            removeElement(openSet, current);

            console.log("CURRENT: " + current);

            for(let neighbor of this.neighbors.get(current)) {
                // d(current,neighbor) is the weight of the edge from current to neighbor
                // tentative_gScore is the distance from start to the neighbor through current
                // tentative_gScore := gScore[current] + d(current, neighbor)
                let tentative_gScore = gScore.get(current) +  current.getDistance(neighbor);

                // if tentative_gScore < gScore[neighbor]
                if (tentative_gScore < gScore.get(neighbor)) {
                    // This path to neighbor is better than any previous one. Record it!
                    // cameFrom[neighbor] := current
                    cameFrom.set(neighbor, current);

                    // gScore[neighbor] := tentative_gScore
                    gScore.set(neighbor, tentative_gScore);

                    // fScore[neighbor] := tentative_gScore + h(neighbor)
                    fScore.set(neighbor, tentative_gScore + heuristic(neighbor, goal));

                    // if neighbor not in openSet
                    if(!openSet.includes(neighbor)) {
                        // # openSet.add(neighbor)
                        openSet.push(neighbor);
                    }
                }
            }
        }

        return [];
    }

}