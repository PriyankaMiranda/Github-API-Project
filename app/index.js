import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


class App extends React.Component{
    constructor(props){
		super(props);
		this.state = {
			data : ''
    	}
    	this.dataHandler = this.dataHandler.bind(this);
  	}

	componentDidMount() {
		var owner = 'facebook'
		var repo = 'react'
		const url = `https://api.github.com/repos/${owner}/${repo}/forks`;
		// Providing 3 arguments (GET/POST, The URL, Async True/False)
		// xhr.open('GET', url, true);

		fetch(url).then(res => {
		  return res.json()
		}).then(res => {
		    this.setState({ data: res});
		}).catch(console.log("error"));

  	}

  	dataHandler (data){this.setState({data:data})}

    render(){
    	console.log(this.state.data)
        return(
            <div>{this.state.data}</div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
