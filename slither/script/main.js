//var Player = require("./player");
//console.log(Player);

function main(param) {
    // console.log("game", g.game);

    var scene = new g.Scene({ 
        game: g.game,
        assetIds: ["dot0", "dot1", "dot2", "dot3", "dot4", "dot5", "dot6", "dot7", "dot8", "dot9", "face", "food", "btn_play"]
     });

    scene.loaded.add(function () {
        console.log("scene loaded");
        new GameCore(scene);

        // var userColors = {}; // ユーザ別の色テーブル

        // // ローカルエンティティで色切り替えボタン (緑)
        // var greenButton = new g.FilledRect({
        //     scene: scene,
        //     // local: true, // ローカルにする
        //     x: 5,
        //     y: 5,
        //     width: 10,
        //     height: 10,
        //     cssColor: "green",
        //     touchable: true,
        //     opacity: 0.3
        // });
        // greenButton.pointUp.add(function (ev) {
        //     // ローカルエンティティのUIの表示を変更
        //     greenButton.opacity = 1;
        //     greenButton.modified();
        //     blueButton.opacity = 0.3; // 非選択状態のものは半透明に
        //     blueButton.modified();

        //     // 全員に自分の色変更イベントを送信 (後述)
        //     g.game.raiseEvent(new g.MessageEvent({
        //         color: "green"
        //     }));
        // });
        // scene.append(greenButton);

        // // ローカルエンティティ色切り替えボタン (青)
        // var blueButton = new g.FilledRect({
        //     scene: scene,
        //     // local: true, // ローカルエンティティ
        //     x: 20,
        //     y: 5,
        //     width: 10,
        //     height: 10,
        //     cssColor: "blue",
        //     touchable: true,
        //     opacity: 0.3
        // });
        // blueButton.pointUp.add(function () {
        //     // ローカルエンティティのUIの表示を変更
        //     greenButton.opacity = 0.3; // 非選択状態のものは半透明に
        //     greenButton.modified();
        //     blueButton.opacity = 1;
        //     blueButton.modified();

        //     // 全員に自分の色変更イベントを送信 (後述)
        //     g.game.raiseEvent(new g.MessageEvent({
        //         color: "blue"
        //     }));
        // });
        // scene.append(blueButton);

        // // (raiseEvent()で全プレイヤーに送信された)MessageEventを受け取る処理: 送信プレイヤーの色情報を更新する
        // scene.message.add(function (msg) {
        //     // 関係ないイベントは無視して抜ける
        //     if (!msg.data || !msg.data.color) return;

        //     // イベントを送信したプレイヤーの色情報を更新する
        //     userColors[msg.player.id] = msg.data.color;
        // });
    });

    g.game.pushScene(scene);
}

function GameCore(scene) {
    console.log("new GameCore");
    var gameCore = this;

    this.start = () => {
        console.log("game start");
        
        // variable
        this.mapWidth = g.game.width * 3;
        this.mapHeight = g.game.height * 3;

        this.players = {};
        this.playersID = [];
        this.snakes = [];
        this.foods = [];

        // layer
        this.rootLayer = new g.E({
            scene: scene,
            x: 0,
            y: 0,
            parent: scene
        });

        this.backgoundLayer = new g.E({
            scene: scene,
            parent: this.rootLayer
        });

        this.foodLayer = new g.E({
            scene: scene,
            parent: this.rootLayer
        });

        this.snakeLayer = new g.E({
            scene: scene,
            parent: this.rootLayer
        });

        this.uiLayer = new g.E({
            scene: scene,
            parent: scene
        });

        // ui
        this.map = new g.Pane({
            scene: scene,
            width: this.mapWidth,
            height: this.mapHeight,
            scaleX: g.game.width / 5 / this.mapWidth,
            scaleY: g.game.height / 5 / this.mapHeight,
            anchorX: .5,
            anchorY: .0,
            x: g.game.width / 2,
            y: 0,
            parent: this.uiLayer
        });

        this.map.border = new g.FilledRect({
            scene: scene,
            cssColor: "grey",
            width: this.mapWidth,
            height: this.mapHeight,
            x: 0,
            y: 0,
            parent: this.map
        });

        this.map.bg = new g.FilledRect({
            scene: scene,
            cssColor: "black",
            width: this.mapWidth - 20,
            height: this.mapHeight - 20,
            x: 10,
            y: 10,
            parent: this.map
        });

        this.map.foods = new g.E({
            scene: scene,
            parent: this.map
        });

        this.map.snakes = new g.E({
            scene: scene,
            parent: this.map
        });

        this.map.frame = new g.FilledRect({
            scene: scene,
            cssColor: "white",
            width: g.game.width,
            height: g.game.height,
            x: 0,
            y: 0,
            opacity: .2,
            parent: this.map
        });

        this.btnPlay = new g.Sprite({
            scene: scene,
            src: scene.assets["btn_play"],
            srcWidth: scene.assets["btn_play"].width,
            srcHeight: scene.assets["btn_play"].height,
            width: 128,
            height: 48,
            anchorX: 0.5,
            anchorY: 1,
            x: g.game.width/2,
            y: g.game.height,
            touchable: true,
            parent: this.uiLayer
        });

        // sprite
        this.background = new g.FilledRect({
            scene: scene,
            cssColor: "black",
            width: this.mapWidth,
            height: this.mapHeight,
            x: 0,
            y: 0,
            parent: this.backgoundLayer
        });

        this.AddFoods(100);

        // add event
        scene.pointDownCapture.add((ev) => {
            // console.log("pointDownCapture", ev);

            if (ev.target != null) {
                return;
            }

            var player = this.players[ev.player.id];
            if (!player) return;

            if (!player.playing) {
                var position = {
                    x: ev.point.x - g.game.width/2 + player.position.x,
                    y: ev.point.y - g.game.height/2 + player.position.y
                };

                if (position.x > 0 && position.y > 0 && position.x < gameCore.mapWidth && position.y < gameCore.mapHeight) {
                    this.CreateFood(position);
                }

                return;
            }

            var snake = player.snake;

            if (g.game.age - player.lastTimeClick < 20) {
                snake.fast = true;
            }
            player.lastTimeClick = g.game.age;

            snake.direction2.x = (ev.point.x) - (g.game.width/2);
            snake.direction2.y = (ev.point.y) - (g.game.height/2);
            snake.direction2.Normalize();
        });

        scene.pointMoveCapture.add((ev) => {
            // console.log("pointMoveCapture", ev);
            
            if (ev.target != null) {
                return;
            }

            var player = this.players[ev.player.id];
            if (!player || !player.playing) return;

            var snake = player.snake;
            snake.direction2.x = (ev.point.x + ev.startDelta.x) - (g.game.width/2);
            snake.direction2.y = (ev.point.y + ev.startDelta.y) - (g.game.height/2);
            snake.direction2.Normalize();
        });

        scene.pointUpCapture.add((ev) => {
            // console.log("pointUpCapture", ev);
            
            if (ev.target != null) {
                return;
            }

            var player = this.players[ev.player.id];
            if (!player || !player.playing) return;

            var snake = player.snake;
            snake.fast = false;
        });

        scene.message.add((msg) => {
            var playerId = msg.player.id;
            console.log("new message from player" + playerId);

            if (!playerId || !msg.data) return;

            //
            if ("new_player_joined" === msg.data.key) {
                if (!gameCore.playersID.includes(playerId)) {
                    gameCore.playersID.push(playerId);
                    console.log("new_player_joined: player" + playerId);

                    var position = gameCore.RandomPlayerPosition();
                    var player = new Player(scene, gameCore, playerId, position);
                    gameCore.players[playerId] = player;

                    if (g.game.selfId === playerId) {
                        gameCore.CenterPlayer(position);
                    }
                }
            }
            
        });

        this.btnPlay.pointUp.add((ev) => {
            var playerId = ev.player.id;
            var player = gameCore.players[playerId];
            if (!player) return;
            player.Play();
        });

        this.Join();
    };
    
    this.update = () => {
        var myPlayer = gameCore.players[g.game.selfId];
        if (!myPlayer || !myPlayer.playing) return;
        this.CenterPlayer(myPlayer.position);
    };

    this.CenterPlayer = (playerPosision) => {
        gameCore.rootLayer.x = g.game.width/2 - playerPosision.x;
        gameCore.rootLayer.y = g.game.height/2 - playerPosision.y;
        gameCore.rootLayer.modified();

        gameCore.map.frame.x = -gameCore.rootLayer.x;
        gameCore.map.frame.y = -gameCore.rootLayer.y;
        gameCore.map.frame.modified();
    };

    this.Join = () => {
        console.log("player" + g.game.selfId + " join");
        g.game.raiseEvent(new g.MessageEvent({
            key: "new_player_joined"
        }));
    };

    this.AddFoods = (num) => {
        for (var i = 0; i < num; i++) {
            this.CreateFood(this.RandomFoodPosition());
        }
    };

    this.CreateFood = (position) => {
        var food = new Food(scene, gameCore, position);
        gameCore.foods.push(food);
    };

    this.RandomFoodPosition = () => {
        return ({
            x: g.game.random.get(0, gameCore.mapWidth),
            y: g.game.random.get(0, gameCore.mapHeight)
        });
    };
 
    this.RandomPlayerPosition = () => {
        return ({
            x: g.game.random.get(g.game.width/2, gameCore.mapWidth - g.game.width/2),
            y: g.game.random.get(g.game.height/2, gameCore.mapHeight - g.game.height/2)
        });
    };
   
    g.game.join.add(function(ev) {
        console.log("join", ev, g.game);
    });

    scene.update.add(this.update);

    this.start();
}

function Player(scene, gameCore, playerId, position) {
    var player = this;

    this.id = playerId;
    this.position = position;

    this.playing = false;
    this.replay = false;
    this.snake = null;

    this.lastTimeClick = 0;

    this.Play = () => {
        if (this.playing) return;
        this.playing = true;

        if (this.replay) {
            this.position = gameCore.RandomPlayerPosition();
        }
        else {
            this.replay = true;
        }

        this.snake = new Snake(scene, gameCore, player);
        gameCore.snakes.push(this.snake);
    };
}

function Snake(scene, gameCore, player) {
    this.position = new Vector2(player.position.x, player.position.y);
    this.direction = new Vector2(1, 0).Normalize();
    this.direction2 = new Vector2(1, 0).Normalize();
    this.entities = [];

    this.dotSize = 32;
    this.distanceBetweenTwoDot = 16;

    this.normalSpeed = 2;
    this.fastSpeed = 4;
    this.speed = 2;
    this.fast = false;

    this.start = () => {
        this.live = true;
        this.death = false;

        this.numFoodEated = 0;

        this.head = null;
        this.lastDot = null;
        
        this.dotImg = scene.assets["dot" + Math.round(g.game.random.get(0, 9))];
        this.faceImg = scene.assets["face"];

        this.dotsGroup = new g.E({
            scene: scene,
            local: true,
            parent: gameCore.snakeLayer
        });

        this.dotMap = new g.Sprite({
            scene: scene,
            src: this.dotImg,
            srcWidth: this.dotImg.width,
            srcHeight: this.dotImg.height,
            width: gameCore.mapHeight / 10,
            height: gameCore.mapHeight / 10,
            anchorX: .5,
            anchorY: .5,
            x: this.position.x,
            y: this.position.y,
            parent: gameCore.map.snakes
        });

        this.CreateEntities();

    };

    this.update = () => {
        if (!this.live) return;

        // movement
        this.speed = this.fast ? this.fastSpeed : this.normalSpeed;
        var s = this.speed;

        if (this.direction.x != this.direction2.x || this.direction.y != this.direction2.y) {
            var angle = Vector2.Angle(this.direction, this.direction2);
            //console.log(angle);

            if (Math.abs(angle) > 3*s) {
                while (angle > 180) {
                    angle -= 360;
                }
                while (angle < -180) {
                    angle += 360;
                }

                Vector2.Rotate(this.direction, angle > 0 ? 3*s : -3*s);
                // console.log(this.direction.Magnitude());
                // this.direction.Normalize();
            }
            else {
                this.direction.x = this.direction2.x;
                this.direction.y = this.direction2.y;
            }
        }

        var delta = new Vector2(this.direction.x * s, this.direction.y * s);

        this.position.x += delta.x;
        this.position.y += delta.y;

        player.position = this.position;

        this.dotMap.x = this.position.x;
        this.dotMap.y = this.position.y;
        this.dotMap.modified();

        var angle = Vector2.Angle(this.direction);
        this.entities[0].angle = angle - 90;
        this.entities[0].x = this.position.x;
        this.entities[0].y = this.position.y;
        this.entities[0].modified();

        var f1 = .8;
        var f2 = 1 - f1;

        for (var i = 1; i < this.entities.length; i++) {
            var direction = new Vector2(this.entities[i-1].x - this.entities[i].x, this.entities[i-1].y - this.entities[i].y).Normalize();
            var delta1 = new Vector2(direction.x * s, direction.y * s);
            var delta2 = new Vector2(-direction.x * this.distanceBetweenTwoDot, -direction.y * this.distanceBetweenTwoDot);

            var point1 = new Vector2(this.entities[i].x + delta1.x, this.entities[i].y + delta1.y);
            var point2 = new Vector2(this.entities[i-1].x + delta2.x, this.entities[i-1].y + delta2.y);

            this.entities[i].x = (point1.x * f1 + point2.x * f2);
            this.entities[i].y = (point1.y * f1 + point2.y * f2);
            this.entities[i].modified();
        }

        // intersect with food
        var i = gameCore.foods.length;
        while (i--) {
            var food = gameCore.foods[i];
            if (!food.eated && this.intersect(this.head, food.entity)) { 
                food.destroy();

                this.numFoodEated++;
                this.AddNewDot();
            }
        }

        // intersect with snake
        var i = gameCore.snakes.length;
        while (i--) {
            var snake = gameCore.snakes[i];
            if (snake.death || snake === this) continue;

            var j = snake.entities.length;
            while (j--) {
                var entity = snake.entities[j];
                if (this.intersect(entity, this.head)) {
                    this.live = false;
                    this.DestroyInNextUpdate();
                    return;
                }
            }
        }

        // out of map
        if (this.position.x < 0 || this.position.x > gameCore.mapWidth || this.position.y < 0 || this.position.y > gameCore.mapHeight) {
            this.live = false;
            this.DestroyInNextUpdate();
        }
    };

    this.CreateEntities = () => {
        var delta = new Vector2(-this.direction.x * this.distanceBetweenTwoDot, -this.direction.y * this.distanceBetweenTwoDot);
        var lastPoint = new Vector2(this.position.x, this.position.y);

        var points = [];
        points.push(lastPoint);

        for (var i = 1; i < 5; i++) {
            lastPoint = new Vector2(lastPoint.x + delta.x, lastPoint.y + delta.y);
            points.push(lastPoint);
        }

        for (var i = 0; i < points.length; i++) {
            this.entities.push(this.CreateDot(points[i], i==0));
        }

        this.head = this.entities[0];
        this.head.update.add(this.update);
    };

    this.AddNewDot = () => {
        var dot1 = this.entities[this.entities.length - 2];
        var dot2 = this.entities[this.entities.length - 1];
        var direction = new Vector2(dot2.x - dot1.x, dot2.y - dot1.y).Normalize();
        var delta = new Vector2(direction.x * this.distanceBetweenTwoDot, direction.y * this.distanceBetweenTwoDot);
        var newPos = new Vector2(dot2.x + delta.x, dot2.y + delta.y);
        var newDot = this.CreateDot(newPos);
        this.entities.push(newDot);
    };
   
    this.CreateDot = (position, isHead) => {
        var dot = new g.Sprite({
            scene: scene,
            local: true,
            src: this.dotImg,
            srcWidth: this.dotImg.width,
            srcHeight: this.dotImg.height,
            width: this.dotSize,
            height: this.dotSize,
            anchorX: .5,
            anchorY: .5,
            x: position.x,
            y: position.y,
            //parent: this.dotsGroup
        });

        if (isHead) {
            new g.Sprite({
                scene: scene,
                local: true,
                src: this.faceImg,
                srcWidth: this.faceImg.width,
                srcHeight: this.faceImg.height,
                width: dot.width,
                height: dot.height,
                anchorX: .5,
                anchorY: .5,
                x: dot.width/2,
                y: dot.height/2,
                parent: dot
            });
        }

        this.dotsGroup.insertBefore(dot, this.lastDot);
        this.lastDot = dot;

        return dot;
    };

    this.DestroyInNextUpdate = () => {
        scene.setTimeout(() => {
            this.Destroy();
        }, 0);
    };

    this.Destroy = () => {
        if (this.dotsGroup.destroyed()) return;

        //gameCore.AddFoods(this.numFoodEated);
        this.entities.forEach((entity) => {
            gameCore.CreateFood({x: entity.x, y: entity.y});
        })
        this.entities = [];
 
        this.dotsGroup.destroy();
        this.dotMap.destroy();

        this.live = false;
        this.death = true;

        var index = gameCore.snakes.indexOf(this);
        if (index !== -1) gameCore.snakes.splice(index, 1);
        player.playing = false;
        player.snake = null;
    };

    this.Fast = () => {
        this.fast = true;

        if (!!this.fastTimeout) {
            scene.clearTimeout(this.fastTimeout);
        }

        this.fastTimeout = scene.setTimeout(1, () => {
            this.fast = false;
            this.fastTimeout = undefined;
        });
    };

    this.intersect = (e1, e2) => {
        var r1 = e1.width / 2;
        var r2 = e2.width / 2;
        var d = r1 + r2;
        var distance = new Vector2(e2.x - e1.x, e2.y - e1.y).SqrMagnitude();
        return distance <= d*d;
    };

    this.start();
}

function Food(scene, gameCore, position) {
    this.size = 16;

    this.start = () => {
        this.eated = false;

        this.position = new Vector2(position.x, position.y);
        // console.log(this.position);

        this.img = scene.assets["food"];

        this.entity = new g.Sprite({
            scene: scene,
            local: true,
            src: this.img,
            srcWidth: this.img.width,
            srcHeight: this.img.height,
            width: this.size,
            height: this.size,
            anchorX: .5,
            anchorY: .5,
            scaleX: 1,
            scaleY: 1,
            x: this.position.x,
            y: this.position.y,
            parent: gameCore.foodLayer
        });

        this.dotMap = new g.FilledRect({
            scene: scene,
            cssColor: "orange",
            width: gameCore.mapHeight / 40,
            height: gameCore.mapHeight / 40,
            anchorX: .5,
            anchorY: .5,
            x: this.position.x,
            y: this.position.y,
            parent: gameCore.map.foods
        });
    };

    this.destroy = () => {
        if (this.entity.destroyed()) return;
        this.entity.destroy();
        this.dotMap.destroy();
        
        this.eated = true;

        var index = gameCore.foods.indexOf(this);
        if (index !== -1) gameCore.foods.splice(index, 1);
    };

    this.start();
}
function Vector2(x, y) {
    this.x = x || 0;
    this.y = y || 0;

    this.Normalize = () => {
        var length = this.Magnitude(); //calculating length
        this.x = this.x/length; //assigning new value to x (dividing x by length of the vector)
        this.y = this.y/length; //assigning new value to y
        return this;
    };

    this.Magnitude = () => {
        return Math.sqrt(this.SqrMagnitude());
    };

    this.SqrMagnitude = () => {
        return this.x*this.x+this.y*this.y;
    };

}

Vector2.Angle = function(vector1, vector2) {
    if (!vector2) return Math.atan2(vector1.y, vector1.x) * 180 / Math.PI;
    return (Math.atan2(vector2.y, vector2.x) - Math.atan2(vector1.y, vector1.x)) * 180 / Math.PI;
}

Vector2.Rotate = function(v, angle) {
    angle *= Math.PI/180;
    var xTemp = v.x;
    v.x = v.x*Math.cos(angle) - v.y*Math.sin(angle);
    v.y = xTemp*Math.sin(angle) + v.y*Math.cos(angle);
}

Vector2.Distance = function(v1, v2) {
    return Math.sqrt(Vector2.SqrDistance(v1, v2));
}

Vector2.SqrDistance = function(v1, v2) {
    return new Vector2(v2.x - v1.x, v2.y - v1.y).SqrMagnitude();
}

module.exports = main;