import React from 'react/addons';
import errorHandler from '../errorHandler';
import MovieCard from '../movies/MovieCard';
import NewSession from './NewSession';
import DoublingGrid from '../movies/DoublingGrid';

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
    query.equalTo('movieSession', this.props.movieSession);
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

  getSortedMovies() {
    const votesByMovieId = _.groupBy(this.state.votes, v => v.attributes.movie.id);

    const rates = Object.keys(votesByMovieId).map(key => {
      const rate = votesByMovieId[key].reduce((acc, v) => acc + v.attributes.vote, 0);
      const nVotes = votesByMovieId[key] ? votesByMovieId[key].length : false;
      return {
        movieId: key,
        rate: rate ? (rate / nVotes) : 0
      };
    });

    return rates
      .sort((a, b) => b.rate - a.rate)
      .filter(rate => this.state.movies.filter(m => m.id === rate.movieId)[0])
      .map((rate, key) => <div className='ui special cards'><MovieCard movie={this.state.movies.filter(m => m.id === rate.movieId)[0]} index={key} key={key}/></div>);
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
        <h1>AND THE WINNER IS...</h1>
        <DoublingGrid columns={4} elements={[Winner]} />
        <br/>
        <h3>ALL THE LOOSERS (sorted by rate)</h3>
        <DoublingGrid columns={4} elements={Loosers} />
      </div>
    );
  }

});