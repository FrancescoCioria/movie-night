import React from 'react/addons';
import errorHandler from '../errorHandler';
import MovieCard from './MovieCard';
import AddMovie from './AddMovie';
import Countdown from '../countdown/Countdown';

export default React.createClass({

  propTypes: {
    onLogout: React.PropTypes.func.isRequired,
    movieSession: React.PropTypes.object.isRequired,
    onSessionEnd: React.PropTypes.func.isRequired,
    sessionEndingAt: React.PropTypes.instanceOf(Date).isRequired
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.getMovies();
    this.getVotes();
  },

  getVotes() {
    const Vote = Parse.Object.extend('Vote');
    const query = new Parse.Query(Vote);
    const { saveVotes } = this;
    query.find({
      success: saveVotes,
      error: errorHandler
    });
  },

  saveVotes(votes) {
    this.setState({ votes });
  },

  getMovies() {
    const Movie = Parse.Object.extend('Movie');
    const query = new Parse.Query(Movie);
    query.equalTo('movieSession', this.props.movieSession);
    const { saveMovies } = this;
    query.find({
      success: saveMovies,
      error: errorHandler
    });
  },

  saveMovies(movies) {
    this.setState({ movies });
  },

  getOthersMovieCards() {
    const generalProps = {
      rate: {
        onRated: this.getVotes,
        votes: this.state.votes
      },
    };

    const movies = this.state.movies.filter(m => m.attributes.user.id !== Parse.User.current().id);
    return (
      <div className='ui special cards movie-list'>
        {movies.map((movie, key) => <MovieCard {...{movie, key}} {...generalProps}/>)}
      </div>
    );
  },

  getMyMovieCards() {
    const generalProps = {
      delete: {
        onDeleted: this.getMovies
      }
    };

    const movies = this.state.movies.filter(m => m.attributes.user.id === Parse.User.current().id);
    return (
      <div className='ui special cards movie-list'>
        {movies.map((movie, key) => <MovieCard {...{movie, key}} {...generalProps}/>)}
      </div>
    );
  },

  countMyMovies() {
    return this.state.movies.filter(movie => movie.attributes.user.id === Parse.User.current().id).length;
  },

  render() {
    if (!this.state.movies || !this.state.votes) {
      return null;
    }

    return (
      <div id='movie-list-page'>
        <div className='top-bar'>
          <AddMovie myMoviesCount={this.countMyMovies()} onAdded={this.getMovies} movieSession={this.props.movieSession}/>
          <Countdown endDate={this.props.sessionEndingAt} onEnd={this.props.onSessionEnd}/>
        </div>
        <h1>Rate tonight's flix!</h1>
        {this.getOthersMovieCards()}
        <h1>Your selection</h1>
        {this.getMyMovieCards()}
      </div>
    );
  }

});