import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Home from './containers/Home';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-fixed">
            <div className="App-logo" alt="logo">
              <div>
              <h1>✔</h1>
              </div>
            </div>
          </div>
          <h1 className="App-title">✔out, ✔in, ✔yourself</h1>
        </header>
        <Home></Home>
      </div>
    );
  }
}

export default App;
