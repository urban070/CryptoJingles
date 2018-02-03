/* eslint-disable */
// TODO - set web3 as eslint global
import React, { Component } from 'react';
import { Link } from 'react-router';
import PendingTxDropdown from './components/PendingTxDropdown/PendingTxDropdown';
import AudioPlayer from './components/AudioPlayer/AudioPlayer';
import Logo from './components/Decorative/Logo';

// Styles
import './css/bootstrap.min.css';
import './css/custom.min.css';
import './css/theme.min.css';
import './App.css';

class App extends Component {
  render() {

    return (
      <div>
        <header className="navbar navbar-default navbar-fixed-top header-wrapper">
          <div className="container">
            <div className="navbar-header">
              <Link to="/" className="navbar-brand">
                <span><Logo /></span>
                Crypto Jingles
              </Link>
              <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
            </div>
            <div className="navbar-collapse collapse" id="navbar-main">
              <ul className="nav navbar-nav navbar-left">
                
                <li>
                  <Link to="/compose">Compose</Link>
                </li>
                <li>
                  <Link to="/marketplace">Marketplace</Link>
                </li>
                <li>
                  {
                    window.web3.eth && 
                    <Link to={`/profile/${window.web3.eth.accounts[0]}`}>Profile</Link>
                  }
                </li>
              </ul>

              <div className="nav navbar-nav navbar-right">
                <PendingTxDropdown />
              </div>
            </div>
          </div>
        </header>

        <div className="children-wrapper">
          {this.props.children}
        </div>

        <AudioPlayer />
      </div>
    );
  }
}

export default App