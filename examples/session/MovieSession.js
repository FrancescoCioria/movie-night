import React from 'react/addons';
import errorHandler from '../errorHandler';
import MovieCard from '../movies/MovieCard';
import NewSession from './NewSession';

export default React.createClass({

  propTypes: {
    movieSession: React.PropTypes.object.isRequired,
    onNewSession: React.PropTypes.func.isRequired
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

  getSortedMovies() {
    const votesByMovieId = _.groupBy(this.state.votes, v => v.attributes.movie.id);
    const winner = Object.keys(votesByMovieId).reduce((acc, key) => {
      const votesCount = votesByMovieId[key].reduce((acc, v) => acc + v.attributes.vote, 0);
      const newAcc = {
        movieId: key,
        votesCount
      };
      return acc && acc.votesCount > votesCount ? acc : newAcc;
    }, null);

    const rates = Object.keys(votesByMovieId).map(key => {
      const rate = votesByMovieId[key].reduce((acc, v) => acc + v.attributes.vote, 0);
      return {
        movieId: key,
        rate
      };
    });

    return rates
      .sort((a, b) => a.rate - b.rate)
      .map(rate => <MovieCard movie={this.state.movies.filter(m => m.id === rate.movieId)[0]} />);
  },

  render() {
    if (!this.state.movies || !this.state.votes) {
      return null;
    }

    const sortedMovies = this.getSortedMovies();
    const Winner = sortedMovies[0];
    const Loosers = sortedMovies.slice(1);

    return (
      <div id='movie-session-page'>
        <NewSession {...this.props}/>
        <h1>And the winner is...</h1>
        <div className='ui special cards' style={{margin: 0}}>
          {Winner}
        </div>
        <br/>
        <h3>All the loosers (sorted by rate)</h3>
        <div className='ui special cards' style={{margin: 0}}>
          {Loosers}
        </div>
      </div>
    );
  }

});