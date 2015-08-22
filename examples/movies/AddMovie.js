import React from 'react';
import axios from 'axios';
import Select from 'react-select';

const omdbSearch = 'http://www.omdbapi.com/?r=json&type=movie&s=';
const omdbByID = 'http://www.omdbapi.com/?r=json&type=movie&tomatoes=true&i=';

export default React.createClass({

  propTypes: {
    myMoviesCount: React.PropTypes.number.isRequired,
    myMoviesMax: React.PropTypes.number,
    onAdded: React.PropTypes.func.isRequired
  },

  getDefaultProps() {
    return {
      myMoviesMax: 20
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
    axios.get(omdbByID + imdbID, headers).then((res) => {
      const Movie = Parse.Object.extend("Movie");
      const movie = new Movie();

      const lowercaseKeys = ['Title', 'Year', 'Plot', 'Poster', 'Runtime'];
      const keys = ['imdbID', 'imdbRating', 'tomatoMeter'];

      lowercaseKeys.forEach(key => {
        movie.set(key.toLowerCase(), res.data[key]);
      });

      keys.forEach(key => {
        movie.set(key, res.data[key]);
      });

      movie.set('user', Parse.User.current())

      const { setLoading } = this;
      const { onAdded } = this.props;

      movie.save(null, {
        success: (movie) => {
          setLoading(false);
          onAdded(movie);
        },
        error: (movie, error) => {
          alert('Failed to create new movie, with error code: ' + error.message);
          setLoading(false);
        }
      });

    });
  },

  setLoading(loading) {
    this.setState({loading});
  },

  countMyMovies() {
    this.state.movies.filter(movie => movie)
  },

  render() {
    const moviesLeft = this.props.myMoviesMax - this.props.myMoviesCount;
    const loading = this.state.loading ? 'loading' : '';
    return (
      <div className={`ui segment ${loading} add-movie`}>
        <h2>You've got {moviesLeft} movies left</h2>
        {moviesLeft > 0 &&<Select asyncOptions={this.getOMDBSuggestions} onChange={this.getOMDBMovie} value=''/>}
      </div>
    );
  }

});