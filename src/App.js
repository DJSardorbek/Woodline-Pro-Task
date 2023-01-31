import React from 'react';
import './App.css';

class App extends React.Component{
    state = {
        count: 0,
        key: true
    }
    handleClick(val) {
        this.setState({count: val});
    }
  render() {
      return (
          <div className="App">
              <h1>{this.state.count}</h1>
              <button
                  onClick={()=> this.handleClick(this.state.count + 1)}>
                  inr
              </button>
              <button
                  onClick={()=> this.handleClick(this.state.count - 1)}>
                  decr
              </button>
              <button
                  onClick={()=> this.handleClick(0)}>
                  reset
              </button>
          </div>
      );
  }
}
export default App;

// es6
// constructor(props) {
//     super(props);
//     this.state = {
//         count: 0,
//         key: true
//         }
//     this.handleClick = this.handleClick.bind(this);
//     }
// first way to change state
// this.handleClick = () => {
//     this.setState((prev) => ({count: prev.count + 1}), () => {
//         console.log('State changed');
//     });
//     this.setState((prev) => ({count: prev.count + 1}));
//     this.setState((prev) => ({count: prev.count + 1}));