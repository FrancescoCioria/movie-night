import React from 'react';
import LoginForm from './login/LoginForm';
import MovieList from './movies/MovieList';

const MovieNight = React.createClass({

  propTypes: {},

  getInitialState() {
    return {
      logged: false,
    };
  },

  login() {
    this.setState({logged: true});
  },

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.setState({logged: false});
    Parse.User.logOut();
  },

  render() {
    if (!this.state.logged) {
      return <LoginForm {...this.state} onLogin={this.login} onLogout={this.logout}/>;
    }


    return (
      <div className='main-page-wrapper'>
        <div className='top-buttons'>
          <button onClick={this.logout}>Logout</button>
        </div>
        <MovieList {...this.state} onLogout={this.logout}/>
      </div>
    );
  }

});

React.render(<MovieNight />, document.getElementById('main'));