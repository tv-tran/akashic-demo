import PieceType = require("./enum/PieceType");
import TeamType = require("./enum/TeamType");
import GameCore = require("./GameCore");
import Cell = require("./interface/Cell");
import Point = require("./interface/Point");
import Size = require("./interface/Size");
import Piece = require("./Piece");
import ViewManager = require("./ViewManager");

class ChessBoard {

	readonly lengthX = 9;
	readonly lengthY = 10;

	readonly cellStart: Point = {x: 66, y: 61};
	readonly cellSize: Size = {width: 77.5, height: 80};

	scene: g.Scene;
	gameCore: GameCore;

	chessboard: g.Sprite;
	pieceLayer: g.E;
	moveLayer: g.E;

	cells: Cell[][];
	pieces: Piece[];

	redGeneral: Piece;
	blackGeneral: Piece;
	pieceShowMove: Piece;
	lastBlackPieceMove: Piece;
	lastRedPieceMove: Piece;

	blackTurns: string[];
	redTurns: string[];

	constructor(scene: g.Scene, gameCore: GameCore) {
		this.scene = scene;
		this.gameCore = gameCore;

		this.chessboard = ViewManager.createChessBoard(this.scene, this.gameCore);
		this.createLayer();
		this.createCells();
		// this.TestCells();
		this.createPieces();

		this.blackTurns = [];
		this.redTurns = [];
	}

	createLayer(): void {
		this.pieceLayer = new g.E({
			scene: this.scene,
			local: true,
			parent: this.chessboard
		});

		this.moveLayer = new g.E({
			scene: this.scene,
			local: true,
			parent: this.chessboard
		});
	}

	createCells(): void {
		this.cells = [];
		for (let i = 0; i < this.lengthY; i++) {
			this.cells.push([]);

			for (let j = 0; j < this.lengthX; j++) {
				this.cells[i].push({
					index: {
						i: i,
						j: j
					},
					point: {
						x: this.cellStart.x + j * this.cellSize.width,
						y: this.cellStart.y + i * this.cellSize.height
					},
					piece: null
				});
			}
		}
	}

	testCells(): void {
		for (let i = 0; i < this.lengthY; i++) {
			for (let j = 0; j < this.lengthX; j++) {
				new g.FilledRect({
					scene: this.scene,
					cssColor: "black",
					width: 10,
					height: 10,
					x: this.cells[i][j].point.x,
					y: this.cells[i][j].point.y,
					local: true,
					parent: this.chessboard
				});
			}
		}
	}

	createPieces(): void {
		let chessBoard = this;
		let scene = this.scene;
		let gameCore = this.gameCore;

		this.pieces = [];
		this.pieceShowMove = null;
		this.lastBlackPieceMove = null;
		this.lastRedPieceMove = null;

		// team red
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][0],
			type: PieceType.Chariot,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][8],
			type: PieceType.Chariot,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][1],
			type: PieceType.Horse,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][7],
			type: PieceType.Horse,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][2],
			type: PieceType.Elephant,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][6],
			type: PieceType.Elephant,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][3],
			type: PieceType.Advisor,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][5],
			type: PieceType.Advisor,
			teamType: TeamType.Red
		}));
		this.pieces.push(this.redGeneral = new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[0][4],
			type: PieceType.General,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[2][1],
			type: PieceType.Cannon,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[2][7],
			type: PieceType.Cannon,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][0],
			type: PieceType.Soldier,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][8],
			type: PieceType.Soldier,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][2],
			type: PieceType.Soldier,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][6],
			type: PieceType.Soldier,
			teamType: TeamType.Red
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[3][4],
			type: PieceType.Soldier,
			teamType: TeamType.Red
		}));

		// team black
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][0],
			type: PieceType.Chariot,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][8],
			type: PieceType.Chariot,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][1],
			type: PieceType.Horse,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][7],
			type: PieceType.Horse,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][2],
			type: PieceType.Elephant,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][6],
			type: PieceType.Elephant,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][3],
			type: PieceType.Advisor,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][5],
			type: PieceType.Advisor,
			teamType: TeamType.Black
		}));
		this.pieces.push(this.blackGeneral = new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[9][4],
			type: PieceType.General,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[7][1],
			type: PieceType.Cannon,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[7][7],
			type: PieceType.Cannon,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][0],
			type: PieceType.Soldier,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][8],
			type: PieceType.Soldier,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][2],
			type: PieceType.Soldier,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][6],
			type: PieceType.Soldier,
			teamType: TeamType.Black
		}));
		this.pieces.push(new Piece(scene, gameCore, chessBoard, {
			cell: this.cells[6][4],
			type: PieceType.Soldier,
			teamType: TeamType.Black
		}));
	}

	flip(): void {
		let teamType = this.gameCore.nico.teamType;
		this.chessboard.angle = teamType === TeamType.Black ? 0 : 180;
		this.chessboard.modified();
	}

	destroy(): void {
		if (this.chessboard.destroyed()) return;
		this.chessboard.destroy();

		this.pieces = [];
		this.cells = [];
	}

	remake(): void {
		for (let i = 0; i < this.lengthY; i++) {
			for (let j = 0; j < this.lengthX; j++) {
				this.cells[i][j].piece = null;
			}
		}

		this.blackTurns = [];
		this.redTurns = [];

		this.chessboard.angle = 0;
		this.chessboard.modified();

		this.pieceLayer.destroy();
		this.moveLayer.destroy();
		this.createLayer();
		this.createPieces();
	}
}

export = ChessBoard;
