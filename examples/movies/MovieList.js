import React from 'react/addons';
import errorHandler from '../errorHandler';
import MovieCard from './MovieCard';
import AddMovie from './AddMovie';

export default React.createClass({

  propTypes: {},

  getInitialState() {
    return {};
  },

  componentDidMount() {
    this.getMovies();
  },

  getMovies() {
    const getOthers = (results) => {
      return results;
    };
    const getMine = (results) => {
      return results;
    };

    const Movie = Parse.Object.extend('Movie');
    const query = new Parse.Query(Movie);
    const { saveMovies } = this;
    query.find({
      success: saveMovies,
      error: (user, error) => errorHandler(error)
    });
  },

  saveMovies(movies) {
    this.setState({ movies });
  },

  addMovie(movie) {
    this.setState({ movies: this.state.movies.concat(movie)});
  },

  getMovieCards() {
    return (
      <div className='ui special cards' style={{margin: 0}}>
        {this.state.movies.map((movie, key) => <MovieCard {...{movie, key}} />)}
      </div>
    );
  },

  render() {
    if (!this.state.movies) {
      return null;
    }

    console.log(this.state.movies[0]);

    return (
      <div>
        <AddMovie myMoviesCount={0} onAdded={this.getMovies}/>
        {this.getMovieCards()}
      </div>
    );
  }

});