import React from 'react/addons';
import errorHandler from '../errorHandler';
import MovieCard from './MovieCard';
import AddMovie from './AddMovie';

export default React.createClass({

  propTypes: {
    onLogout: React.PropTypes.func.isRequired
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
    const { saveMovies } = this;
    query.find({
      success: saveMovies,
      error: errorHandler
    });
  },

  saveMovies(movies) {
    this.setState({ movies });
  },

  addMovie(movie) {
    this.setState({ movies: this.state.movies.concat(movie)});
  },

  getOthersMovieCards() {
    const generalProps = {
      onRated: this.getVotes,
      votes: this.state.votes
    };

    const movies = this.state.movies.filter(m => m.attributes.user.id !== Parse.User.current().id);
    return (
      <div className='ui special cards' style={{margin: 0}}>
        {this.state.movies.map((movie, key) => <MovieCard {...{movie, key}} {...generalProps}/>)}
      </div>
    );
  },

  getMyMovieCards() {
    const generalProps = {
      onRated: this.getVotes,
      onDeleted: this.getMovies,
      votes: this.state.votes
    };

    const movies = this.state.movies.filter(m => m.attributes.user.id === Parse.User.current().id);
    return (
      <div className='ui special cards' style={{margin: 0}}>
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
        <AddMovie myMoviesCount={this.countMyMovies()} onAdded={this.getMovies}/>
        <h1>Rate tonight's flix!</h1>
        {this.getOthersMovieCards()}
        <h1>Your selection</h1>
        {this.getMyMovieCards()}
      </div>
    );
  }

});