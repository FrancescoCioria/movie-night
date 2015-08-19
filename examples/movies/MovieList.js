import React from 'react/addons';
import imdb from 'imdb-api';
import errorHandler from '../errorHandler';
import MovieCard from './MovieCard';
import Select from 'react-select';

// const imdb = 'http://www.imdb.com/xml/find?json=1&nr=1&tt=on&q=';

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
    console.log('GETTING MOVIES');
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
    // axios.get(imdb + input, headers).then((res) => {
    //   console.log(res);
    // });

    imdb.getReq({name: input}, (err, res) => {
      console.log(err, res);
    });
  },

  getMovieCards() {
    return (
      <div className='ui special cards' style={{margin: 0}}>
        {this.state.movies.map((movie, key) => <MovieCard movie={movie} key={i} />)}
      </div>
    );
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