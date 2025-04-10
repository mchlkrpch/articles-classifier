import React from "react";
import storage from '../redux_storage'

export default class InfoBlock extends React.Component{
	constructor(args) {
			super(args)
			this.state = {
				ref: React.createRef(),
				t: args.t,
				p: args.p,
				blockname: args.blockname,
				visible: false,
			}
			storage.dispatch({
				type: 'add_block',
				payload: [this.state.blockname, this]
			})
		}

		switch_visibility() {
			this.setState({
				visible: this.state.visible == false? true: false,
			})
		}

		render() {
			if (this.state.visible) {
				return (
					<div ref={this.state.ref} className='infoblock-frame'>
						<h2>{this.state.t}</h2>
						<p>{this.state.p}</p>
					</div>
				)
			} else {
				return <></>
			}
		}
}