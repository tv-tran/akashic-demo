import ChessBoard = require("./ChessBoard");
import Point = require("./interface/Point");
import Nico = require("./Nico");

class GameCore {

	center: Point;
	scene: g.Scene;
	chessboard: ChessBoard;
	nico: Nico;

	chessboardLayer: g.E;
	infoLayer: g.E;
	panelLayer: g.E;

	started: boolean;
	ended: boolean;

	constructor(scene: g.Scene) {
		this.scene = scene;
		this.ended = false;
		this.started = false;

		this.center = {
			x: g.game.width/2,
			y: g.game.height/2
		};

		this.chessboardLayer = new g.E({
			scene: scene,
			parent: scene
		});

		this.infoLayer = new g.E({
			scene: scene,
			parent: scene
		});

		this.panelLayer = new g.E({
			scene: scene,
			parent: scene
		});

		this.chessboard = new ChessBoard(scene, this);

		this.nico = new Nico(scene, this);
		
		this.scene.message.add(ev => {
			if (ev.data.message === "PieceMove") {
				let piece = this.chessboard.pieces[ev.data.pieceIndex];
				let cell = this.chessboard.cells[ev.data.cellIndex.i][ev.data.cellIndex.j];
				piece.moveTo(cell, ev.player.id);
			}
		});
	}

	endGame(): void {
		if (this.ended) return;
		this.ended = true;

		this.nico.onGameEnded();
	}

	remake(): void {
		this.ended = false;
		this.started = false;

		// this.chessboard.destroy();
		// this.chessboard = new ChessBoard(this.scene, this);
		this.chessboard.remake();
	}
}

export = GameCore;
