import PieceType = require("./enum/PieceType");
import TeamType = require("./enum/TeamType");
import Cell = require("./interface/Cell");
import Index = require("./interface/Index");
import Piece = require("./Piece");

const lengthX = 9;
const lengthY = 10;

class Rules {

	static findMove(piece: Piece, cells: Cell[][]): Cell[] {
		let result: Cell[] = [];

		let pieceType = piece.type;
		let teamType = piece.teamType;
		let cell = piece.cell;

		let index0: Index;
		let index1: Index;
		let index2: Index;

		switch (pieceType) {
			case PieceType.Cannon:
				let fuse = false;
				for (let i = cell.index.i + 1; i < lengthY; i++) {
					let _cell = cells[i][cell.index.j];
					if (!fuse) {
						if (!_cell.piece) {
							result.push(_cell);
						} else fuse = true;
					} else {
						if (_cell.piece) {
							if (_cell.piece.teamType !== teamType) {
								result.push(_cell);
							}
							break;
						}
					}
				}

				fuse = false;
				for (let i = cell.index.i - 1; i >= 0; i--) {
					let _cell = cells[i][cell.index.j];
					if (!fuse) {
						if (!_cell.piece) {
							result.push(_cell);
						} else fuse = true;
					} else {
						if (_cell.piece) {
							if (_cell.piece.teamType !== teamType) {
								result.push(_cell);
							}
							break;
						}
					}
				}

				fuse = false;
				for (let j = cell.index.j + 1; j < lengthX; j++) {
					let _cell = cells[cell.index.i][j];
					if (!fuse) {
						if (!_cell.piece) {
							result.push(_cell);
						} else fuse = true;
					} else {
						if (_cell.piece) {
							if (_cell.piece.teamType !== teamType) {
								result.push(_cell);
							}
							break;
						}
					}
				}

				fuse = false;
				for (let j = cell.index.j - 1; j >= 0; j--) {
					let _cell = cells[cell.index.i][j];
					if (!fuse) {
						if (!_cell.piece) {
							result.push(_cell);
						} else fuse = true;
					} else {
						if (_cell.piece) {
							if (_cell.piece.teamType !== teamType) {
								result.push(_cell);
							}
							break;
						}
					}
				}
				break;

			case PieceType.Chariot:
				for (let i = cell.index.i + 1; i < lengthY; i++) {
					let _cell = cells[i][cell.index.j];
					if (this.checkCell(_cell, piece)) {
						result.push(_cell);
					}
					if (!!_cell.piece) {
						break;
					}
				}

				for (let i = cell.index.i - 1; i >= 0; i--) {
					let _cell = cells[i][cell.index.j];
					if (this.checkCell(_cell, piece)) {
						result.push(_cell);
					}
					if (!!_cell.piece) {
						break;
					}
				}

				for (let j = cell.index.j + 1; j < lengthX; j++) {
					let _cell = cells[cell.index.i][j];
					if (this.checkCell(_cell, piece)) {
						result.push(_cell);
					}
					if (!!_cell.piece) {
						break;
					}
				}

				for (let j = cell.index.j - 1; j >= 0; j--) {
					let _cell = cells[cell.index.i][j];
					if (this.checkCell(_cell, piece)) {
						result.push(_cell);
					}
					if (!!_cell.piece) {
						break;
					}
				}
				break;

			case PieceType.Soldier:
				index1 = {
					i: cell.index.i + (teamType === TeamType.Red ? 1 : -1),
					j: cell.index.j
				};
				this.checkMoveSoldier(piece, cells, result, index1);

				if (this.checkOvercomeRiver(cell.index.i, piece)) {
					index1 = {
						i: cell.index.i,
						j: cell.index.j + 1
					};
					this.checkMoveSoldier(piece, cells, result, index1);

					index1 = {
						i: cell.index.i,
						j: cell.index.j - 1
					};
					this.checkMoveSoldier(piece, cells, result, index1);
				}

				break;

			case PieceType.Horse:
				index0 = {
					i: cell.index.i + 1,
					j: cell.index.j
				};
				index1 = {
					i: cell.index.i + 2,
					j: cell.index.j + 1
				};
				index2 = {
					i: cell.index.i + 2,
					j: cell.index.j - 1
				};
				this.checkMoveHorse(piece, cells, result, index0, index1);
				this.checkMoveHorse(piece, cells, result, index0, index2);

				index0 = {
					i: cell.index.i - 1,
					j: cell.index.j
				};
				index1 = {
					i: cell.index.i - 2,
					j: cell.index.j + 1
				};
				index2 = {
					i: cell.index.i - 2,
					j: cell.index.j - 1
				};
				this.checkMoveHorse(piece, cells, result, index0, index1);
				this.checkMoveHorse(piece, cells, result, index0, index2);

				index0 = {
					i: cell.index.i,
					j: cell.index.j + 1
				};
				index1 = {
					i: cell.index.i + 1,
					j: cell.index.j + 2
				};
				index2 = {
					i: cell.index.i - 1,
					j: cell.index.j + 2
				};
				this.checkMoveHorse(piece, cells, result, index0, index1);
				this.checkMoveHorse(piece, cells, result, index0, index2);

				index0 = {
					i: cell.index.i,
					j: cell.index.j - 1
				};
				index1 = {
					i: cell.index.i + 1,
					j: cell.index.j - 2
				};
				index2 = {
					i: cell.index.i - 1,
					j: cell.index.j - 2
				};
				this.checkMoveHorse(piece, cells, result, index0, index1);
				this.checkMoveHorse(piece, cells, result, index0, index2);
				break;

			case PieceType.Elephant:
				index0 = {
					i: cell.index.i + 1,
					j: cell.index.j + 1
				};
				index1 = {
					i: cell.index.i + 2,
					j: cell.index.j + 2
				};
				this.checkMoveElephant(piece, cells, result, index0, index1);

				index0 = {
					i: cell.index.i + 1,
					j: cell.index.j - 1
				};
				index1 = {
					i: cell.index.i + 2,
					j: cell.index.j - 2
				};
				this.checkMoveElephant(piece, cells, result, index0, index1);

				index0 = {
					i: cell.index.i - 1,
					j: cell.index.j + 1
				};
				index1 = {
					i: cell.index.i - 2,
					j: cell.index.j + 2
				};
				this.checkMoveElephant(piece, cells, result, index0, index1);

				index0 = {
					i: cell.index.i - 1,
					j: cell.index.j - 1
				};
				index1 = {
					i: cell.index.i - 2,
					j: cell.index.j - 2
				};
				this.checkMoveElephant(piece, cells, result, index0, index1);
				break;

			case PieceType.Advisor:
				index1 = {
					i: cell.index.i + 1,
					j: cell.index.j + 1
				};
				this.checkMoveAdvisor(piece, cells, result, index1);
				index1 = {
					i: cell.index.i + 1,
					j: cell.index.j - 1
				};
				this.checkMoveAdvisor(piece, cells, result, index1);
				index1 = {
					i: cell.index.i - 1,
					j: cell.index.j + 1
				};
				this.checkMoveAdvisor(piece, cells, result, index1);
				index1 = {
					i: cell.index.i - 1,
					j: cell.index.j - 1
				};
				this.checkMoveAdvisor(piece, cells, result, index1);
				break;

			case PieceType.General:
				index1 = {
					i: cell.index.i + 1,
					j: cell.index.j
				};
				this.checkMoveAdvisor(piece, cells, result, index1);

				index1 = {
					i: cell.index.i - 1,
					j: cell.index.j
				};
				this.checkMoveAdvisor(piece, cells, result, index1);

				index1 = {
					i: cell.index.i,
					j: cell.index.j + 1
				};
				this.checkMoveAdvisor(piece, cells, result, index1);

				index1 = {
					i: cell.index.i,
					j: cell.index.j - 1
				};
				this.checkMoveAdvisor(piece, cells, result, index1);

				//
				let cell0 = piece.chessBoard.redGeneral.cell;
				let cell1 = piece.chessBoard.blackGeneral.cell;
				if (this.checkRevealGenerals(cell0, cell1, cells)) {
					if (teamType === TeamType.Red) {
						result.push(cell1);
					} else {
						result.push(cell0);
					}
				}

				break;
		}

		return result;
	}

	static checkRevealGenerals(cell0: Cell, cell1: Cell, cells: Cell[][]): boolean {
		let b = cell0.index.j === cell1.index.j;
		if (b) {
			for (let i = cell0.index.i + 1; i < cell1.index.i; i++) {
				if (cells[i][cell0.index.j].piece) {
					b = false;
					break;
				}
			}
		}
		return b;
	}

	//
	static checkMoveHorse(piece: Piece, cells: Cell[][], result: Cell[], index0: Index, index: Index): void {
		if (this.checkIndex(index0) && this.checkIndex(index)) {
			let cell0 = cells[index0.i][index0.j];
			let cell = cells[index.i][index.j];
			if (!cell0.piece && this.checkCell(cell, piece)) {
				result.push(cell);
			}
		}
	}

	static checkMoveElephant(piece: Piece, cells: Cell[][], result: Cell[], index0: Index, index: Index): void {
		if (this.checkIndex(index0) && this.checkIndex(index) && !this.checkOvercomeRiver(index.i, piece)) {
			let cell0 = cells[index0.i][index0.j];
			let cell = cells[index.i][index.j];
			if (!cell0.piece && this.checkCell(cell, piece)) {
				result.push(cell);
			}
		}
	}

	static checkMoveAdvisor(piece: Piece, cells: Cell[][], result: Cell[], index: Index): void {
		if (this.checkAdvisorIndex(index, piece)) {
			let cell = cells[index.i][index.j];
			if (this.checkCell(cell, piece)) {
				result.push(cell);
			}
		}
	}

	static checkMoveSoldier(piece: Piece, cells: Cell[][], result: Cell[], index: Index): void {
		if (this.checkIndex(index)) {
			let cell = cells[index.i][index.j];
			if (this.checkCell(cell, piece)) {
				result.push(cell);
			}
		}
	}

	//
	static checkCell(cell: Cell, piece: Piece): boolean {
		return !cell.piece || cell.piece.teamType !== piece.teamType;
	}

	static checkOvercomeRiver(indexI: number, piece: Piece): boolean {
		return piece.teamType === TeamType.Red ? indexI > 4 : indexI < 5;
	}

	static checkAdvisorIndex(index: Index, piece: Piece): boolean {
		return (index.j >= 3 && index.j <= 5
		&& (piece.teamType === TeamType.Red ? index.i >= 0 && index.i <= 2 : index.i >= 7 && index.i <= 9));
	}

	//
	static checkIndex(index: Index): boolean {
		return this.checkIndexIJ(index.i, index.j);
	}

	static checkIndexIJ(indexI: number, indexJ: number): boolean {
		return this.checkIndexI(indexI) && this.checkIndexJ(indexJ);
	}

	static checkIndexI(indexI: number): boolean {
		return indexI >= 0 && indexI < lengthY;
	}

	static checkIndexJ(indexJ: number): boolean {
		return indexJ >= 0 && indexJ < lengthX;
	}
}

export = Rules;
