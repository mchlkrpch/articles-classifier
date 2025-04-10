import React from "react";

import {ReactSVG} from 'react-svg';

export default class Icon extends React.Component {
	constructor(args) {
		super(args)
		this.state = {
			active: args.active,
			ic: args.ic,
			ref: React.createRef(),
			f: args.f,
		}
	}

	render() {
		return (
			<div
				className={!this.state.active? 'icon-frame': 'active-frame'}
				onClick={()=>{
					this.state.f()
				}}
				>
				<ReactSVG
					className="inner-icon"
					src={this.state.ic}
					beforeInjection={(svg) => {
						svg.setAttribute('style', 'width: 100%; height: 100%;')
					}}
					/>
			</div>
		)
	}
}