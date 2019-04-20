<template>
  <div :class="isWin ? 'player winner' : 'player'">
  	<div class="player-point">{{this.pointFormat(point)}}</div>
    <div class="player-name">{{name}}</div>
		<div class="cards">
			<template v-if="cards.length">
				<div v-for="card in cards" class="card" :key="card.code">
					<Card :image="card.image" :code="card.code"  :gameStatus="gameStatus" />
				</div>
			</template>
			<template v-else>
				<div class="card" v-for="i in 3" :key="i">
					<Card :image="cardPlaceholder" code="NONE" :key="i"  :gameStatus="gameStatus" />
				</div>
			</template>
		</div>
		<div class="player-score">Score: {{score}}</div>
  </div>
</template>

<script>
import Card from '../Card/Card.vue';
import cardPlaceholder from '@/assets/card-placeholder.png';
export default {
	name: 'Player',
	components: {
		Card,
	},
	props: {
		isWin: Boolean,
		cards: Array,
		score: Number,
		name: String,
		point: Number,
		gameStatus: String,
	},
	data() {
		return{
			cardPlaceholder
		}
	},
	methods: {
		pointFormat: function(val) {
			return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}
	}
};
</script>