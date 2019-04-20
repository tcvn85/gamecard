import axios from 'axios';

axios.defaults.baseURL = 'https://deckofcardsapi.com/api/';

export default {

	// https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1
	getDeskCards() {
		return axios.get(`/deck/new/shuffle/?deck_count=1`);
	},

	//https://deckofcardsapi.com/api/deck/<<deck_id>>/shuffle/)
	getReshuffleCards(deck_id) {
		return axios.get(`deck/${deck_id}/shuffle/`);
	},

	// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=3)
	getDrawCards(deck_id) {
		return axios.get(`deck/${deck_id}/draw/?count=3`);
	},

	// https://deckofcardsapi.com/api/deck/<<deck_id>>/draw/?count=3)
	getDrawCards(deck_id) {
		return axios.get(`deck/${deck_id}/draw/?count=3`);
	},

	getDrawCards(deck_id, numPlayers) {
		let promises = [];
		for(let i = 0; i < numPlayers; i++){
     	promises.push(axios.get(`deck/${deck_id}/draw/?count=3`));
    }
    return axios.all(promises);
	},

}