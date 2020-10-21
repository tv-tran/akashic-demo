var distanceBetweenTwoDot = 10;
var dotSize = 10;

function Player(scene) {
    this.position = new Vector2(g.game.width / 2, g.game.height / 2);
    this.direction = new Vector2(1, 1).Normalize();
    this.entities = [];

    function CreateEntities() {
        var delta = new Vector2(-this.direction.x * distanceBetweenTwoDot, -this.direction.y * distanceBetweenTwoDot);
        var lastPoint = new Vector2(this.position.x, this.position.y);

        var points = [];
        points.push(lastPoint);

        for (var i = 1; i < 10; i++) {
            lastPoint = new Vector2(lastPoint.x + delta.x, lastPoint.y + delta.y);
            points.push(lastPoint);
        }

        for (var i = 0; i < points.length; i++) {
            this.entities.push(CreateDot(points[i]));
        }
    }
   
    function CreateDot(position) {
        return new g.FilledRect({
            scene: scene,
            x: position.x,
            y: position.y,
            width: dotSize,
            height: dotSize,
            cssColor: "green"
        });
    }

}

function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;

    this.Normalize = function() {
        var length = Math.sqrt(this.x*this.x+this.y*this.y); //calculating length
        this.x = this.x/length; //assigning new value to x (dividing x by length of the vector)
        this.y = this.y/length; //assigning new value to y
        return this;
    }
}

module.exports = Player;