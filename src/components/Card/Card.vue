<template>
  
  <img :src="cardImgHide" :alt="code" width="45" v-if="gameStatus === status" />
  <img :src="image" :alt="code" width="45" v-else />

</template>


<script>
import cardImgHide from '@/assets/card-hide.png';
import CONFIG from '@/Config';

export default {
	name: 'Card',
	props: {
		image: String,
		code: String,
		gameStatus: String,
	},
	data() {
		return {
			cardImgHide,
			status: CONFIG.REVEAL
		}
	}
	
};
</script>
