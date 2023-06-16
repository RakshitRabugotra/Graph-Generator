var _pj;

function _pj_snippets(container) {
  function in_es6(left, right) {
    if (right instanceof Array || typeof right === "string") {
      return right.indexOf(left) > -1;
    } else {
      if (right instanceof Map || right instanceof Set || right instanceof WeakMap || right instanceof WeakSet) {
        return right.has(left);
      } else {
        return left in right;
      }
    }
  }

  container["in_es6"] = in_es6;
  return container;
}

_pj = {};

_pj_snippets(_pj);
/*
Contains definition for Graph and Circle*/


export class Circle {
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

export class Graph {
  /*
  Class to represent Graphs in the code
  */
  constructor(vertices, edges) {
    this.vertices = vertices;
    this.edges = edges;
    this.neighbors = {};

    this.__parseNeighbors();
  }

  isNeighbor(v1, v2) {
    return _pj.in_es6(v2, this.neighbors[v1]);
  }

  __parseNeighbors() {
    var vertex0, vertex1;

    for (var edge, _pj_c = 0, _pj_a = this.edges, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      edge = _pj_a[_pj_c];
      [vertex0, vertex1] = edge;

      if (!_pj.in_es6(vertex0, this.neighbors)) {
        this.neighbors[vertex0] = [vertex1];
      }

      if (!_pj.in_es6(vertex1, this.neighbors)) {
        this.neighbors[vertex1] = [vertex0];
      }

      if (_pj.in_es6(vertex0, this.neighbors) && _pj.in_es6(vertex1, this.neighbors)) {
        this.neighbors[vertex0] += [vertex1];
        this.neighbors[vertex1] += [vertex0];
      }
    }
  }

  find_path(start, end, path = []) {
    /*
    Finds path between two vertices
    */
    var new_path;
    path = path + [start];

    if (start === end) {
      return path;
    }

    for (var node, _pj_c = 0, _pj_a = this.neighbors[start], _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      node = _pj_a[_pj_c];

      if (!_pj.in_es6(node, path)) {
        new_path = this.find_path(node, end, path);

        if (new_path) {
          return new_path;
        }
      }
    }
  }

  __reconstruct_path(cameFrom, current) {
    var total_path;
    total_path = [current];

    while (_pj.in_es6(current, cameFrom)) {
      current = cameFrom[current];
      total_path = [current] + total_path;
    }

    return total_path;
  }

  A_star(start, goal, heuristic) {
    /*
    Implementation of A* search algorithm
    */
    var cameFrom, current, f, fScore, g, gScore, openSet, tentative_gScore;

    g = (thisVertex, nextVertex) => {
      return thisVertex.getDistance(nextVertex);
    };

    f = (thisVertex, nextVertex) => {
      return g(thisVertex, nextVertex) + heuristic(thisVertex, nextVertex);
    };

    openSet = [start];
    cameFrom = {};
    gScore = {};

    for (var node, _pj_c = 0, _pj_a = this.vertices, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      node = _pj_a[_pj_c];
      gScore[node] = math.inf;
    }

    gScore[start] = 0;
    fScore = {};

    for (var node, _pj_c = 0, _pj_a = this.vertices, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      node = _pj_a[_pj_c];
      fScore[node] = math.inf;
    }

    fScore[start] = heuristic(start, goal);

    while (openSet.length > 0) {
      current = min(openSet, {
        "key": vertex => {
          return fScore[vertex];
        }
      });

      if (current === goal) {
        return this.__reconstruct_path(cameFrom, current);
      }

      openSet.remove(current);

      for (var neighbor, _pj_c = 0, _pj_a = this.neighbors[current], _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        neighbor = _pj_a[_pj_c];
        tentative_gScore = gScore[current] + current.getDistance(neighbor);

        if (tentative_gScore < gScore[neighbor]) {
          cameFrom[neighbor] = current;
          gScore[neighbor] = tentative_gScore;
          fScore[neighbor] = tentative_gScore + heuristic(neighbor, goal);

          if (!_pj.in_es6(neighbor, openSet)) {
            openSet.append(neighbor);
          }
        }
      }
    }

    return [];
  }

}
