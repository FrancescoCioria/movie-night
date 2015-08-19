import React from 'react/addons';
import axios from 'axios';
import errorHandler from '../errorHandler';
import MovieCard from './MovieCard';
import Select from 'react-select';

const omdbSearch = 'http://www.omdbapi.com/?y=&r=json&type=movie&s=';

export default React.createClass({

  propTypes: {},

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

  getIMDBSuggestions(input, cb) {
    const headers = {
      'Accept': 'application/json'
    };
    axios.get(omdbSearch + input, headers).then((res) => {
      const options = res.data.Search.map((movie) => {
        return {
          label: `${movie.Title} (${movie.Year})`,
          value: movie.imdbID
        };
      });
      cb(null, {options});
    });
  },

  getMovieCards() {
    return (
      <div className='ui special cards' style={{margin: 0}}>
        {this.state.movies.map((movie, key) => <MovieCard {...{movie, key}} />)}
      </div>
    );
  },

  countMyMovies() {
    this.state.movies.filter(movie => movie)
  },

  render() {
    if (!this.state) {
      return null;
    }

    return (
      <div>

        <Select asyncOptions={this.getIMDBSuggestions}/>
        {this.getMovieCards()}
      </div>
    );
  }

});