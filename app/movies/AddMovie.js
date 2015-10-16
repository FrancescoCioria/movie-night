import React from 'react';
import axios from 'axios';
import errorHandler from '../errorHandler';
import Select from 'react-select';

const tmdbAPIKey = '0c3776904afeef58578a4be938fa2cdb';
const tmdbById = (imdbID) => `http://api.themoviedb.org/3/find/${imdbID}?external_source=imdb_id&api_key=${tmdbAPIKey}`;
const tmdbImage = (image) => `https://image.tmdb.org/t/p/w185/${image}`;

const omdbSearch = 'http://www.omdbapi.com/?r=json&type=movie&s=';
const omdbByID = (imdbID) => `http://www.omdbapi.com/?r=json&type=movie&tomatoes=true&i=${imdbID}`;

export default React.createClass({

  propTypes: {
    movieSession: React.PropTypes.object.isRequired,
    myMoviesCount: React.PropTypes.number.isRequired,
    myMoviesMax: React.PropTypes.number,
    onAdded: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      myMoviesMax: 2
    };
  },

  getInitialState() {
    return {
      loading: false
    };
  },

  getOMDBSuggestions(input, cb) {
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
      this.options = {options};
      cb(null, this.options);
    });
  },

  getOMDBMovie(imdbID) {
    const headers = {
      'Accept': 'application/json'
    };

    axios.get(tmdbById(imdbID), headers)
      .then((res) => Promise.resolve(tmdbImage(res.data.movie_results[0].poster_path)))
      .then((poster) => {
        axios.get(omdbByID(imdbID), headers).then((res) => {
          const Movie = Parse.Object.extend('Movie');
          const movie = new Movie();

          const lowercaseKeys = ['Title', 'Year', 'Plot', 'Runtime'];
          const keys = ['imdbID', 'imdbRating', 'tomatoMeter'];

          lowercaseKeys.forEach(key => {
            movie.set(key.toLowerCase(), res.data[key]);
          });

          keys.forEach(key => {
            movie.set(key, res.data[key]);
          });

          movie.set('poster', poster);
          movie.set('user', Parse.User.current());
          movie.set('movieSession', this.props.movieSession);

          const { setLoading } = this;
          const { onAdded } = this.props;

          movie.save(null, {
            success: (movie) => {
              setLoading(false);
              onAdded(movie);
            },
            error: (movie, error) => {
              errorHandler(movie, error);
              setLoading(false);
            }
          });

        });
      });
  },

  setLoading(loading) {
    this.setState({loading});
  },

  countMyMovies() {
    this.state.movies.filter(movie => movie);
  },

  render() {
    const moviesLeft = this.props.myMoviesMax - this.props.myMoviesCount;
    const loading = this.state.loading ? 'loading' : '';
    return (
      <div className={`ui segment ${loading} add-movie`}>
        <h2>You can select {moviesLeft} more movies</h2>
        {moviesLeft > 0 && <Select asyncOptions={this.getOMDBSuggestions} onChange={this.getOMDBMovie} value=''/>}
      </div>
    );
  }

});