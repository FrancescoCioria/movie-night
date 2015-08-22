import React from 'react';
import errorHandler from './errorHandler';
import LoginForm from './login/LoginForm';
import MovieList from './movies/MovieList';
import MovieSession from './session/MovieSession';

const MovieNight = React.createClass({

  propTypes: {},

  getInitialState() {
    return {
      logged: false
    };
  },

  login() {
    this.setState({logged: true});
    this.getMovieSession();
  },

  logout() {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    this.setState({logged: false});
    Parse.User.logOut();
  },

  getMovieSession() {
    const MovieSession = Parse.Object.extend('MovieSession');
    const query = new Parse.Query(MovieSession);
    query.equalTo('active', true);
    const { saveMovieSession } = this;
    query.find({
      success: saveMovieSession,
      error: errorHandler
    });
  },

  saveMovieSession(movieSessions) {
    this.setState({movieSession: movieSessions[0]});
  },

  render() {
    if (!this.state.logged) {
      return <LoginForm {...this.state} onLogin={this.login} onLogout={this.logout}/>;
    }

    if (!this.state.movieSession) {
      return null;
    }

    const now = new Date();
    const endingAt = new Date(this.state.movieSession.attributes.endingAt);

    const buttons = (
      <div className='top-buttons'>
        <button onClick={this.logout}>Logout</button>
      </div>
    );

    let body = endingAt < now ?
      <MovieSession {...this.state} onNewSession={this.getMovieSession}/>
      :
      <MovieList {...this.state} onLogout={this.logout} sessionEndingAt={endingAt} onSessionEnd={this.getMovieSession}/>;

    return (
      <div className='main-page-wrapper'>
        {buttons}
        {body}
      </div>
    );
  }

});

React.render(<MovieNight />, document.getElementById('main'));