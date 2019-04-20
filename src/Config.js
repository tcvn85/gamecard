const PLAYERS_DEFAULT = [
				{position: 'top', name: 'Player 1', isWin: false, point: 20000, cards: [], score: 0},
				{position: 'right', name: 'Player 2', isWin: false, point: 20000, cards: [], score: 0},
				{position: 'bottom', name: 'Me', isWin: false, point: 20000, cards: [], score: 0},
				{position: 'left', name: 'Player 4', isWin: false, point: 20000, cards: [], score: 0},
			];

const FINISH = 'FINISH';
const START = 'START';
const SHUFFLE = 'SHUFFLE';
const DRAW = 'DRAW';
const REVEAL = 'REVEAL';
const NEXT_ROUND = 'NEXT ROUND';
const BET = 5000;
const END_GAME = 5; // 5 round

export default {
	PLAYERS_DEFAULT,
	START,
	SHUFFLE,
	DRAW,
	REVEAL,
	NEXT_ROUND,
	FINISH,
	BET,
	END_GAME
}