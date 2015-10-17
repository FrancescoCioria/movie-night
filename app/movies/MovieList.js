import React from 'react/addons';
import { partial } from 'lodash';
import errorHandler from '../errorHandler';
import DoublingGrid from './DoublingGrid';
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

  contextTypes: {
    isMobile: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return {
      tab: 1
    };
  },

  componentDidMount() {
    this.getMovies();
    this.getVotes();
    this.interval = setInterval(this.getMovies, 5000);
  },

  componentWillUnmount() {
    clearInterval(this.interval);
  },

  setTab(tab) {
    this.setState({ tab });
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

  getOthersMovieCards() {
    const generalProps = {
      rate: {
        onRated: this.getVotes,
        votes: this.state.votes,
        movieSession: this.props.movieSession
      }
    };

    const movies = this.state.movies.filter(m => m.attributes.user.id !== Parse.User.current().id);
    return movies.map((movie, key) => <div className='ui special cards movie-list'><MovieCard {...{movie, key, index: key}} {...generalProps}/></div>);
  },

  getMyMovieCards() {
    const generalProps = {
      delete: {
        onDeleted: this.getMovies
      }
    };

    const movies = this.state.movies.filter(m => m.attributes.user.id === Parse.User.current().id);
    return movies.map((movie, key) => <div className='ui special cards movie-list'><MovieCard {...{movie, key, index: key}} {...generalProps}/></div>);
  },

  countMyMovies() {
    return this.state.movies.filter(movie => movie.attributes.user.id === Parse.User.current().id).length;
  },

  render() {
    const { votes, movies, tab } = this.state;
    if (!movies || !votes) {
      return null;
    }

    const cards = tab === 1 ? this.getOthersMovieCards() : this.getMyMovieCards();

    return (
      <div id='movie-list-page'>
        <div className='top-bar'>
          <Countdown endDate={this.props.sessionEndingAt} onEnd={this.props.onSessionEnd} compact={this.context.isMobile}/>
        </div>
        <div className='tabs'>
          <div className={`tab ${tab === 1 ? 'active' : ''}`} onClick={partial(this.setTab, 1)}>
            Rate tonight's flix
          </div>
          <div className={`tab ${tab === 2 ? 'active' : ''}`} onClick={partial(this.setTab, 2)}>
            Your selection
          </div>
        </div>
        {tab === 2 && <AddMovie myMoviesCount={this.countMyMovies()} onAdded={this.getMovies} movieSession={this.props.movieSession}/>}
        <DoublingGrid columns={4} elements={cards} />
      </div>
    );
  }

});