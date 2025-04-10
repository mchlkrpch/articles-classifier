import React from 'react'

import Icon from './Icon'
import qicon from '../img/m.svg'
import micon from '../img/m2.svg'
import searchicon from '../img/search-white.svg'

import storage from '../redux_storage'

import { HOST_NAME } from '../App'

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
			const cookies = document.cookie.split(';');
			for (let i = 0; i < cookies.length; i++) {
					const cookie = cookies[i].trim();
					if (cookie.substring(0, name.length + 1) === (name + '=')) {
							cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
							break;
					}
			}
	}
	return cookieValue;
}

function request_article_review(q) {
	const csrftoken = getCookie('csrftoken');
	var xhr = new XMLHttpRequest();
	xhr.open(
		"POST",
		HOST_NAME + "/get_article/",
		false,
	)
	xhr.setRequestHeader('X-CSRFToken', csrftoken);
	xhr.withCredentials = true;

	xhr.setRequestHeader(
		'Content-Type',
		'application/x-www-form-urlencoded'
	)

	xhr.send(
		"q=" + encodeURIComponent(q)
	)

	while (xhr.readyState !== 4);
	let data = JSON.parse(xhr.responseText)
	return data
}

export class Searcher extends React.Component {
	constructor(args) {
    super(args)
		this.state = {
			ref: React.createRef()
		}
  }

	render() {
		return (
			<div className='searchbox'>
				<div className='row'>
					<input
						className='seach-input'
						placeholder='type article to search'
						ref={this.state.ref}
						/>
					<Icon
						f={()=>{
							let data = request_article_review(this.state.ref.current.value)
							console.log('recieved data:', data)
							storage.dispatch({
								type: 'display_articles',
								payload: [data['articles'], data['classes']],
							})
						}}
						active={true}
						ic={searchicon}
						/>
				</div>
				<div className='row'>
					<Icon
						f={()=>{
							storage.dispatch({
								type: 'switch_visibility',
								payload: 'appinfo'
							})
						}}
						ic={qicon}
						/>
					<Icon
						f={()=>{
							storage.dispatch({
								type: 'switch_visibility',
								payload: 'modelinfo'
							})
						}}
						ic={micon}
						/>
					<div className='space'/>
					ищем все на:<a href='https://arxiv.org/'>arxiv.org</a>
				</div>
			</div>
		)
	}
}