import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import './index.css';


class App extends React.Component{
    constructor(props){
		super(props);
		this.state = {owner:'facebook',repo:'react',name: '',img : '',link: '',type:'',description:'',
					issues:'',downloads:'',projects:'',wiki:'',license:'',perPage: 5,page: 0,counter: 0}
    	this.update = this.update.bind(this);
  	}

	componentDidMount() {
		var owner = 'facebook'
		var repo = 'react'
		var page = '100'
		var counter = '0'
		const url = `https://api.github.com/repos/${owner}/${repo}/forks?page=${page}&per_page=100`;
		
		fetch(url).then(res => {
		  return res.json()
		}).then(res => {
			console.log(res)
			var my_data = { owner: owner , repo: repo, page: page,
						name : res[counter]["owner"]["login"], img : res[counter]["owner"]["avatar_url"],
						link : res[counter]["owner"]["html_url"], type : res[counter]["owner"]["type"],
						description : res[counter]["language"], issues : res[counter]["has_issues"],
						downloads : res[counter]["has_downloads"], projects : res[counter]["has_projects"],
						wiki : res[counter]["has_wiki"], license : res[counter]["license"]["name"]}
		    this.setState(my_data);
		}).catch(console.log("error"));

  	}

	update(e) {
		e.preventDefault();
		console.log("next!")
		this.state.page = this.state.page + 1
		const url = `https://api.github.com/repos/${this.state.owner}/${this.state.repo}/forks?page=${this.state.page}&per_page=100`;

		fetch(url).then(res => {
		  return res.json()
		}).then(res => {
			var my_data = {owner: this.state.owner , repo: this.state.repo, data: "my_data", page: this.state.page,
						name : res[counter]["owner"]["login"], img : res[counter]["owner"]["avatar_url"],
						link : res[counter]["owner"]["html_url"], type : res[counter]["owner"]["type"],
						description : res[counter]["language"], issues : res[counter]["has_issues"],
						downloads : res[counter]["has_downloads"], projects : res[counter]["has_projects"],
						wiki : res[counter]["has_wiki"], license : res[counter]["license"]["name"]}
		    this.setState(my_data);
		}).catch(console.log("error"));
		
	}

    render(){
		console.log(this.state)
		return (
		<div class="card">
			<div class="container">
				<h4><b>{this.state.name}</b></h4>
				<h4><b>{this.state.img}</b></h4>
				<h4><b>{this.state.link}</b></h4>
				<h4><b>{this.state.type}</b></h4>
				<h4><b>{this.state.description}</b></h4>
				<h4><b>{this.state.issues}</b></h4>
				<h4><b>{this.state.downloads}</b></h4>
				<h4><b>{this.state.projects}</b></h4>
				<h4><b>{this.state.wiki}</b></h4>
				<h4><b>{this.state.license}</b></h4>
				<form id="my-form" onSubmit={this.update}>
					<button type="submit">Next</button>
				</form>
			</div>
		</div>


		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
