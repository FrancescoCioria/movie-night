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

  setLogged() {
    this.setState({logged: true});
  },

  render() {
    return this.state.logged ?
      <MovieList {...this.state} />
      : <LoginForm {...this.state} onSuccess={this.setLogged}/>;
  }

});

React.render(<MovieNight />, document.getElementById('main'));