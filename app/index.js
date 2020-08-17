import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
const { Octokit } = require("@octokit/core");
import './index.css';
const keys = require("./token.js");


class App extends React.Component{
    constructor(props){
		super(props);
		this.state = {owner:'facebook',repo:'react',name: '',img : '',link: '',type:'',description:'',issues:'',
					downloads:'',projects:'',wiki:'',license:'',page: 0,counter: 0,max_counter:99, totalPages:0 }
    	this.update = this.update.bind(this);
    	this.handlePageClick = this.handlePageClick.bind(this);
    	this.checkData = this.checkData.bind(this);
  	}

	componentDidMount() {
		console.log(keys.test)
		var owner = 'facebook'
		var repo = 'react'
		var page = '1'
		var counter = '0'
		const url = `https://api.github.com/repos/${owner}/${repo}/forks?page=${page}&per_page=100`;
		
		// ------------getting total number of forks to set maximum number for paginate------------
		this.checkData(page,Math.floor(page/2),page*2, 900)
		// ----------------------------------------------------------------------------------------

		fetch(url).then(res => {
			return res.json()
		}).then(res => {
			var my_data = { owner: owner , repo: repo, page: page,
						name : res[counter]["owner"]["login"], img : res[counter]["owner"]["avatar_url"],
						link : res[counter]["owner"]["html_url"], type : res[counter]["owner"]["type"],
						description : res[counter]["language"], issues : res[counter]["has_issues"],
						downloads : res[counter]["has_downloads"], projects : res[counter]["has_projects"],
						wiki : res[counter]["has_wiki"], license : res[counter]["license"]["name"]}
		    this.setState(my_data);
		}).catch(console.log("error"));

  	}

	checkData(page, lower_bound, upper_bound, cut_off) {
		cut_off = cut_off - 1
		var owner = 'facebook'
		var repo = 'react'
		const url = `https://api.github.com/repos/${owner}/${repo}/forks?page=${page}&per_page=100`;
		fetch(url).then(res => {
			return res.json()
		}).then(res => {
			console.log(res.length)
			console.log(lower_bound)
			console.log(upper_bound)
			console.log(page)
			if(upper_bound - lower_bound < 2 || cut_off == 0 || upper_bound == lower_bound){
				console.log(res)
				console.log(cut_off)
				console.log("done1")
			}
			else if(res.length == 100){
				// we need to go higher
				console.log("upper bound")
				this.setState({totalPages: parseInt(page)*100});
				this.checkData(parseInt(upper_bound), parseInt(page)+parseInt(Math.floor(((upper_bound-page)/2))), parseInt(upper_bound*2),parseInt(cut_off)) 
			}else if (res.length == 0){
				// we need to go lower
				console.log("lower bound")
				this.checkData(parseInt(lower_bound),parseInt(lower_bound)-(parseInt(page)-parseInt(lower_bound))+parseInt(1),parseInt(page)-parseInt(1),parseInt(cut_off)) 
			}else{
				//this is it 
				console.log(res)
				this.setState({totalPages:parseInt(page-1)*100+parseInt(res.length)});
				console.log("done2")
			}
		}).catch(console.log("error"));

	}

	update(e) {
		const url = `https://api.github.com/repos/${this.state.owner}/${this.state.repo}/forks?page=${this.state.page}&per_page=${this.state.max_counter+1}`;
		fetch(url).then(res => {
			return res.json()
		}).then(res => {
			var my_data = {owner: this.state.owner , repo: this.state.repo, data: "my_data", page: this.state.page,
						name : res[this.state.counter]["owner"]["login"], img : res[this.state.counter]["owner"]["avatar_url"],
						link : res[this.state.counter]["owner"]["html_url"], type : res[this.state.counter]["owner"]["type"],
						description : res[this.state.counter]["language"], issues : res[this.state.counter]["has_issues"],
						downloads : res[this.state.counter]["has_downloads"], projects : res[this.state.counter]["has_projects"],
						wiki : res[this.state.counter]["has_wiki"], license : res[this.state.counter]["license"]["name"]}
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
