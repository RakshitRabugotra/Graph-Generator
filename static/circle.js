/**
 * Class to represent circles in the code
 */
class Circle {
    constructor(x, y, radius, name) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.name = name;
      this.isHighlighted = false;
    }
  
    isNull() {
      return (this.name === null);
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
      return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
  
  }