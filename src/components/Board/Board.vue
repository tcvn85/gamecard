<template>
  <div class="board" :style="{width: windowWidth + 'px'}">
    <template v-if="gameStatus !== 'START' || round !== 1">
    	<Player v-for="(player, index) in players" 
    				:class="`player-${player.position}`" 
    				:name="player.name" 
    				:point="player.point" 
    				:key="index" 
    				:cards="player.cards"
    				:score="player.score"
    				:isWin="player.isWin"
    				:gameStatus="gameStatus" />
	    <div class="round">
	    	<div class="round-name">Round {{round}}</div>
	    	<button class="btn" @click="handleStartGame">{{gameStatus}}</button>
	    </div>
	  </template>
	  <div class="round" v-else>
	  	<h1>BAI CAO</h1>
	  	<button class="btn" @click="handleStartGame">{{gameStatus}}</button>
	  </div>
		
	  <div v-if="loading" class="loading"></div>

	  <div class="end-game" v-if="endGame">
	  	<div>
		  	<h2>Congratulations!</h2>
				<div class="congra-names"><strong v-for="(winner, index) in winners"><span v-if="index !== 0">- </span>{{winner.name}} </strong></div>
				<button class="btn btn-secondary mt-3" @click="hanldeResetGame">RESET</button>
		  </div>
	  </div>
  </div>
</template>

<script>
import Player from '@/components/Player/Player.vue';
import CONFIG from '@/Config';
import Api from '@/Api';


export default {
	name: 'Board',
	components: {
		Player,
	},
	data() {
		return {
			loading: false,
			round: 1,
			endGame: false,
			winners: [],
			deck_id: null,
			gameStatus: CONFIG.START,
			players: CONFIG.PLAYERS_DEFAULT,
			windowWidth: window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth,
		}
	},
	mounted(){
		window.addEventListener( 'resize', this.handleResize )
	},
	beforeDestroy: function () {
  	window.removeEventListener( 'resize', this.handleResize )
	},
	computed: {
		scores: function(){
			this.players.map( player => {

			});
		}
	},
	methods: {
		handleResize(){
			const board = document.querySelector('.board')
			const quare = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth
			board.style.width = quare + 'px'
			board.style.height = quare + 'px'
		},
		handleStartGame() {
			this.loading = true;
			switch(this.gameStatus) {
				case CONFIG.SHUFFLE:
						Api.getReshuffleCards(this.deck_id)
							.then( response => {
								if (response.data){
									this.deck_id = response.data.deck_id;
									this.gameStatus = CONFIG.DRAW;
									// console.log('SHUFFLED');
								}
							})
							.catch( (error) => {
		            console.log(error);
		            this.loading = false;
		          })
		          .finally(() => {
		            this.loading = false;
		          });
					break;
				case CONFIG.DRAW:
					Api.getDrawCards(this.deck_id, this.players.length)
						.then( response => {
							this.players.map((player,index) => {
								player.cards = response[index].data.cards;
							});
							this.gameStatus = CONFIG.REVEAL;
							// console.log('DRAWED');
						})
						.catch( (error) => {
	            console.log(error);
	            this.loading = false;
	          })
	          .finally(() => {
	            this.loading = false;
	          });
					break;
				case CONFIG.REVEAL:

					let scoreWin = 0,
							scoreWinIndex = 0,
					    scoreWinLap = 0;
					this.players.map( (player, index) => {
						let score = 0;
						player.cards.map(card => {
							score += this.calCodeScore(card.code);
						});
						score = score === 30 ? 30 : score % 10;
						this.players[index].score = score;

						if (score === 30 || scoreWin <= score ) {
							scoreWin = score;
							scoreWinIndex = index;
						}
					});

					// get lap 
					const maxScore = this.players[scoreWinIndex].score;
					this.players.map( (player) => {
						if (player.score === maxScore) {
							scoreWinLap++;
						}
					});
					
					// console.log('maxScore: ' + maxScore + ' lap ' + scoreWinLap);
					this.players.map( (player, index) => {
						if (player.score === maxScore) {
							this.players[index].isWin = true;
							if (scoreWinLap === 1) {
								this.players[index].point +=  CONFIG.BET * (this.players.length - scoreWinLap);
							} else if (scoreWinLap === 2) {
								this.players[index].point +=  CONFIG.BET;	
							} else if (scoreWinLap === 3) {
								this.players[index].point +=  Math.round(CONFIG.BET /  3, 10);
							} 
						} else {
							this.players[index].point -=  CONFIG.BET;
						}
					});
					this.loading = false;

					this.gameStatus = CONFIG.NEXT_ROUND;	

					// console.log('REVEALED');
					break;

				case CONFIG.NEXT_ROUND:

					this.checkGameEnd();
					this.round = this.round + 1;
					this.gameStatus = CONFIG.START;
						
					this.loading = false;
					if (!this.endGame) {
						this.resetRound();
					} else {
						this.gameStatus = CONFIG.FINISH;
						this.getWinnerList();
					}
					
					break;

				default: // START GAME
					Api.getDeskCards()
						.then(response => {
							if (response.data){
								this.gameStatus = CONFIG.SHUFFLE;
								this.deck_id = response.data.deck_id;
								// console.log('STARTED');
							}
						})
						.catch( error => {
	            console.log(error);
	            this.loading = false;
	          })
	          .finally(() => {
	            this.loading = false;
	          });
			}
		},
		calCodeScore(code){
			const firstLetter = code.charAt(0);
			switch(firstLetter) {
				case 'A':
					return 1;
				case 'J':
				case 'Q':
				case 'K':
					return 10;
				default:
					return parseInt(firstLetter);
			}
		},

		resetRound() {
			this.players.map( (player, index) => {
				this.players[index].score = 0;
				this.players[index].cards = [];
				this.players[index].isWin = false;
			})
		},

		checkGameEnd() {
      this.players.map( (player) => {
				if (player.point <= 0 || this.round === CONFIG.END_GAME) {
					this.endGame = true;
				}
			});
		},
		getWinnerList() {
			const maxPoint = Math.max(...this.players.map(p => p.point), 0);
			this.winners = [];
      this.players.map( (player) => {
      	if (player.point === maxPoint) {
      		this.winners.push(player);
      	}
      });
		},
		hanldeResetGame() {
			this.loading = false;
			this.round = 1;
			this.endGame =  false;
			this.winners = [];
			this.deck_id = null;
			this.gameStatus = CONFIG.START;
			this.players = [
				{position: 'top', name: 'Player 1', isWin: false, point: 20000, cards: [], score: 0},
				{position: 'right', name: 'Player 2', isWin: false, point: 20000, cards: [], score: 0},
				{position: 'bottom', name: 'Me', isWin: false, point: 20000, cards: [], score: 0},
				{position: 'left', name: 'Player 4', isWin: false, point: 20000, cards: [], score: 0},
			];
		},
	}
};
</script>
