import React from "react"
import storage from "../redux_storage"
import Icon from "./Icon"
import hideicon from '../img/hide.svg'

export class Article extends React.Component {
	constructor(args) {
    super(args)
		this.state = {
			data: args.data,
			class: args.class,
			hide: true,
		}
  }

	render() {
		return (
			<div
				className="article-frame"
				>
				<h2 style={{color: 'green'}}>{this.state.class}</h2>
				<div className="row">
					<p className="paletext">T:</p>
					<h2>{this.state.data[0]}</h2>
				</div>
				<div className="row">
					<p className="paletext">A:</p>
					<h2>{this.state.data[1]}</h2>
				</div>
				<p>{this.state.data[2].substr(0,this.state.hide? 100: this.state.data[2].length)}</p>
				<Icon
					f={()=>{
						this.setState({
							hide: this.state.hide == true? false: true,
						})
					}}
					ic={hideicon}
					/>
			</div>
		)
	}
}


export class RobertaAnswers extends React.Component {
	constructor(args) {
    super(args)
		this.state = {
			status: 'none',
			articles: [],
			classes: [],
		}

		storage.dispatch({
			type: 'set_response_component',
			payload: this,
		})
  }

	setStatus(s) {
		this.setState({
			status: s
		})
	}

	render() {
		return (
			this.state.status == 'none'? (
				<></>
			):(
				this.state.status == 'found'? (
					<>
						{
							this.state.articles.map((e, i)=>
								<Article
									key={i}
									data={e}
									class={this.state.classes[i]}
									/>
							)
						}
					</>
				): (
					<>error</>
				)
			)
		)
	}
}