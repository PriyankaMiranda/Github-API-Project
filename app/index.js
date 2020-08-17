import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
const { Octokit } = require("@octokit/core");
import './index.css';


class App extends React.Component{
    constructor(props){
		super(props);
		this.state = {owner:'',repo:'',accessToken:'',name: '',img : '',link: '',type:'',description:'',issues:'',
					downloads:'',projects:'',license:'',page: 0,counter: 0,max_counter:99, totalPages:0, 
					language:'',defaultBranch:'',watchers:'', projectLink:''}
    	this.update = this.update.bind(this);
    	this.updateData = this.updateData.bind(this);
    	this.handlePageClick = this.handlePageClick.bind(this);
    	this.checkData = this.checkData.bind(this);
    	this.follow = this.follow.bind(this);
  	}


	componentDidMount() {
		// -----------------------------------set button functions----------------------------------
		document.getElementById("button").onclick= (e) => {
			e.preventDefault()
			var owner = document.getElementById("user-id").value 
			var repo = document.getElementById("repo-id").value
			var accessToken = document.getElementById("token-id").value
			document.getElementsByClassName("overlay")[0].style.display = "none";
			this.updateData(owner, repo, accessToken)
		};
		document.getElementById("follow").onclick= (e) => {
			e.preventDefault()
			this.follow()
		};
		// ----------------------------------------------------------------------------------------

  	}


	updateData(owner, repo, accessToken){
		var page = '1'
		var counter = '0'
		const url = `https://api.github.com/repos/${owner}/${repo}/forks?page=${page}&per_page=100`;

		// -----------------------set owner,repo and accessToken-----------------------------------
		this.setState({owner: owner , repo: repo, accessToken:accessToken});
		// ----------------------------------------------------------------------------------------

		// ------------getting total number of forks to set maximum number for paginate------------
		this.checkData(page,Math.floor(page/2),page*2, 900)
		// ----------------------------------------------------------------------------------------

		// ----------------------------------load first user data----------------------------------
		fetch(url).then(res => {
			return res.json()
		}).then(res => {
			var my_data = {name : res[counter]["owner"]["login"], img : res[counter]["owner"]["avatar_url"],
						link : res[counter]["owner"]["html_url"], type : res[counter]["owner"]["type"],
						description : res[counter]["description"], issues : res[counter]["has_issues"]? 'Yes' : 'No',
						downloads : res[counter]["has_downloads"]? 'Yes' : 'No', 
						projects : res[counter]["has_projects"]? 'Yes' : 'No',
						language:res[counter]["language"]?res[counter]["language"]:'Not specified',page: page, 
						defaultBranch: res[counter]["default_branch"],license : res[counter]["license"]["name"],
						watchers: res[counter]["watchers_count"],projectLink: res[counter]["html_url"]}
		    this.setState(my_data);
		}).catch(console.log("error"));
		// ----------------------------------------------------------------------------------------
	}

	checkData(page, lower_bound, upper_bound, cut_off) {

		cut_off = cut_off - 1
		var owner = 'facebook'
		var repo = 'react'
		const url = `https://api.github.com/repos/${owner}/${repo}/forks?page=${page}&per_page=100`;
		fetch(url).then(res => {
			return res.json()
		}).then(res => {
			if(upper_bound - lower_bound < 2 || cut_off == 0 || upper_bound == lower_bound){
				this.setState({totalPages:parseInt(page-1)*100+parseInt(res.length)});
			}
			else if(res.length == 100){
				// we need to go higher
				this.setState({totalPages: parseInt(page)*100});
				this.checkData(parseInt(upper_bound), parseInt(page)+parseInt(Math.floor(((upper_bound-page)/2))), parseInt(upper_bound*2),parseInt(cut_off)) 
			}else if (res.length == 0){
				// we need to go lower
				this.checkData(parseInt(lower_bound),parseInt(lower_bound)-(parseInt(page)-parseInt(lower_bound))+parseInt(1),parseInt(page)-parseInt(1),parseInt(cut_off)) 
			}else{
				//this is it
				this.setState({totalPages:parseInt(page-1)*100+parseInt(res.length)});
			}
		}).catch(console.log("error"));

	}



	follow(){
		console.log("sdsfbjkwebviebr")
		const octokit = new Octokit({ auth: this.state.accessToken });
		var command = `PUT /user/following/${this.state.name}`;
		octokit.request(command, {username: this.state.name})
	}

	update(e) {
		const url = `https://api.github.com/repos/${this.state.owner}/${this.state.repo}/forks?page=${this.state.page}&per_page=${this.state.max_counter+1}`;
		fetch(url).then(res => {
			return res.json()
		}).then(res => {
			console.log(res)
			var my_data = {name : res[this.state.counter]["owner"]["login"], page: this.state.page,
						img : res[this.state.counter]["owner"]["avatar_url"],
						link : res[this.state.counter]["owner"]["html_url"], 
						type : res[this.state.counter]["owner"]["type"],
						description : res[this.state.counter]["description"], 
						issues : res[this.state.counter]["has_issues"]? 'Yes' : 'No',
						downloads : res[this.state.counter]["has_downloads"]? 'Yes' : 'No', 
						projects : res[this.state.counter]["has_projects"]? 'Yes' : 'No',
						license : res[this.state.counter]["license"]["name"],
						language:res[this.state.counter]["language"]?res[this.state.counter]["language"]:'Not specified',
						defaultBranch: res[this.state.counter]["default_branch"],
						watchers: res[this.state.counter]["watchers_count"],
						projectLink: res[this.state.counter]["html_url"]}
		    this.setState(my_data);
		}).catch(console.log("error"));
	}


	handlePageClick (e) {
		const selectedPage = Math.trunc(e.selected/100);
		const offset = e.selected % 100;
		console.log("offset: "+offset)
		this.state.page
		this.setState({
			page: selectedPage,
			counter: offset
		}, () => {
			this.update(e)
		});

	};

    render(){
		console.log(this.state)

		return (
		<div class="card">
			<div class="container">
				<h1><b>{this.state.name}</b></h1>
				<img src={this.state.img} class="avatar" />
				<h4>Visit <a href={this.state.link}>Github</a> profile or <a href={this.state.projectLink}>project</a></h4>
				
				<p> <b>Type :</b> {this.state.type} &nbsp;&nbsp;&nbsp;<b>Default branch :</b> {this.state.defaultBranch} &nbsp;&nbsp;&nbsp;<b>License :</b> {this.state.license}</p>
				<br></br>
				<h3><b>Description</b></h3>
				<p>{this.state.description}</p>
				<br></br>
				<p> <b>Has issues :</b> {this.state.issues} &nbsp;&nbsp;&nbsp;<b>Has Downloads :</b> {this.state.downloads} &nbsp;&nbsp;&nbsp;<b>Has Projects :</b> {this.state.projects} &nbsp;&nbsp;&nbsp;<b>Language :</b> {this.state.language}</p>
				
				<button type="submit" id="follow" value="Follow account" >Follow</button>
                <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}/>
			</div>
		</div>


		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'))
