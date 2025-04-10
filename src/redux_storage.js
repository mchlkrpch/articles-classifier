import { createStore } from 'redux'

let initState = {
  blocks: {},
	display_articles: [],
	response_component: null,
};

const reducer = (state = initState, action) => {
	switch (action.type) {
		case 'add_block':
			let new_name = action.payload[0];
			let new_ref = action.payload[1];
			let oldblocks = state.blocks;

			oldblocks[new_name] = new_ref
			return {
				...state,
				blocks: oldblocks,
			}

		case 'switch_visibility':
			let nm = action.payload;
			let block = state.blocks[nm];
			block.switch_visibility();
			return {...state}
		
		case 'set_response_component':
			let c = action.payload;
			return {
				...state,
				response_component: c,
			}
		
		case 'display_articles':
			let [articles, classes] = action.payload;
			let response_component = state.response_component
			console.log("A:",articles)
			response_component.setStatus('found')
			response_component.setState({
				articles: articles,
				classes: classes
			})
			return {
				...state,
				articles: articles,
			}

		default:
			return {
				...state,
			}
	}
}

const storage = createStore(reducer)
export default storage