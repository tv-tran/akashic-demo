import ChessBoard = require("./ChessBoard");
import PieceType = require("./enum/PieceType");
import PlayerStatus = require("./enum/PlayerStatus");
import TeamType = require("./enum/TeamType");
import GameCore = require("./GameCore");
import Cell = require("./interface/Cell");
import Rules = require("./Rules");
import ViewManager = require("./ViewManager");

interface Props {
	cell: Cell;
	type: PieceType;
	teamType: TeamType;
}

class Piece {

	scene: g.Scene;
	gameCore: GameCore;
	chessBoard: ChessBoard;

	cell: Cell;
	type: PieceType;
	teamType: TeamType;

	sprite: g.Sprite;

	constructor(scene: g.Scene, gameCore: GameCore, chessBoard: ChessBoard, props: Props) {
		this.scene = scene;
		this.gameCore = gameCore;
		this.chessBoard = chessBoard;

		this.cell = props.cell;
		this.type = props.type;
		this.teamType = props.teamType;

		this.cell.piece = this;

		this.sprite = ViewManager.createPiece(this);

		this.sprite.pointUp.add((event: g.PointUpEvent) => {
			if (!this.gameCore.started || this.gameCore.ended) return;
			if (this.gameCore.nico.playerStatus === PlayerStatus.Watcher) return;
			if (this.gameCore.nico.teamType !== this.teamType) return;
			if (this.gameCore.nico.currentTeamTurn !== this.teamType) return;

			if (this.chessBoard.pieceShowMove === this) return;
			
			let lastPieceMove = this.teamType === TeamType.Black ? this.chessBoard.lastBlackPieceMove : this.chessBoard.lastRedPieceMove;
			if (lastPieceMove === this) return;

			let turns = this.teamType === TeamType.Black ? this.chessBoard.blackTurns : this.chessBoard.redTurns;
			if (turns.indexOf(event.player.id) >= 0) return;

			(scene.assets.se as g.AudioAsset).play();

			this.clearMove();

			let cells = Rules.findMove(this, this.chessBoard.cells);
			cells.forEach((cell) => {
				this.createMove(this, cell);
			});

			this.chessBoard.pieceShowMove = this;
		});
	}

	clearMove(): void {
		this.chessBoard.pieceShowMove = null;
		if (!!this.chessBoard.moveLayer.children) {
			let i = this.chessBoard.moveLayer.children.length;
			while (i--) {
				this.chessBoard.moveLayer.children[i].destroy();
			}
		}
	}

	createMove(piece: Piece, cell: Cell): void {
		let move = ViewManager.createMove(piece, cell);

		move.pointUp.add((event: g.PointUpEvent) => {
			// this.moveTo(cell);
			g.game.raiseEvent(new g.MessageEvent({
				message: "PieceMove",
				pieceIndex: this.chessBoard.pieces.indexOf(this),
				cellIndex: cell.index
			}));
			this.clearMove();
		});
	}

	checkMove(playerId: string): boolean {
		if (!this.gameCore.started || this.gameCore.ended) return false;
		if (this.gameCore.nico.playerStatus === PlayerStatus.Watcher) return false;
		if (this.gameCore.nico.teamType !== this.teamType) return false;
		if (this.gameCore.nico.currentTeamTurn !== this.teamType) return false;
		
		let lastPieceMove = this.teamType === TeamType.Black ? this.chessBoard.lastBlackPieceMove : this.chessBoard.lastRedPieceMove;
		if (lastPieceMove === this) return false;

		let turns = this.teamType === TeamType.Black ? this.chessBoard.blackTurns : this.chessBoard.redTurns;
		if (turns.indexOf(playerId) >= 0) return false;

		return true;
	}

	moveTo(cell: Cell, playerId: string): void {
		console.log("player " + playerId + " move piece");

		let piece = this;

		if(this.chessBoard.pieceShowMove === this) {
			this.clearMove();
		}

		if (this.teamType === TeamType.Black) {
			this.chessBoard.lastBlackPieceMove = this;
			this.chessBoard.blackTurns.push(playerId);
			this.gameCore.nico.removePlayerTurn(playerId);

			if (this.chessBoard.blackTurns.length === this.gameCore.nico.blackTeams.length) {
				this.chessBoard.lastBlackPieceMove = null;
				this.chessBoard.blackTurns = [];
				this.gameCore.nico.toggleTurn();
			}
		}
		else {
			this.chessBoard.lastRedPieceMove = this;
			this.chessBoard.redTurns.push(playerId);
			this.gameCore.nico.removePlayerTurn(playerId);

			if (this.chessBoard.redTurns.length === this.gameCore.nico.redTeams.length) {
				this.chessBoard.lastRedPieceMove = null;
				this.chessBoard.redTurns = [];
				this.gameCore.nico.toggleTurn();
			}
		}

		piece.sprite.x = cell.point.x;
		piece.sprite.y = cell.point.y;
		piece.sprite.modified();

		if (!!cell.piece) {
			if (cell.piece.type === PieceType.General) {
				this.gameCore.endGame();
			}

			cell.piece.destroy();
		}

		piece.cell.piece = null;
		cell.piece = piece;
		piece.cell = cell;
	}

	destroy(): void {
		if (this.sprite.destroyed()) return;
		this.sprite.destroy();

		let index = this.chessBoard.pieces.indexOf(this);
		this.chessBoard.pieces.splice(index, 1);
	}

}

export = Piece;
