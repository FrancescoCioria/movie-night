import React from 'react/addons';
import errorHandler from '../errorHandler';
import Rating from '../rating/Rating';
import Review from './Review';

export default React.createClass({

  propTypes: {
    movie: React.PropTypes.shape({
      attributes: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        imdbID: React.PropTypes.string.isRequired,
        year: React.PropTypes.string.isRequired,
        imdbRating: React.PropTypes.string.isRequired,
        tomatoMeter: React.PropTypes.string.isRequired,
        poster: React.PropTypes.string.isRequired,
        plot: React.PropTypes.string.isRequired,
        runtime: React.PropTypes.string.isRequired,
        user: React.PropTypes.object.isRequired
      }).isRequired
    }).isRequired,
    rate: React.PropTypes.shape({
      votes: React.PropTypes.array.isRequired,
      onRated: React.PropTypes.func.isRequired,
      movieSession: React.PropTypes.object
    }),
    delete: React.PropTypes.shape({
      onDeleted: React.PropTypes.func.isRequired
    }),
    index: React.PropTypes.number.isRequired
  },

  getInitialState() {
    return {};
  },

  componentDidMount() {
    const delay = this.props.index * 50;
    setTimeout(this.setSRC, delay);
  },

  setSRC() {
    this.setState({src: this.props.movie.attributes.poster});
  },

  delete() {
    this.props.movie.destroy({
      success: this.props.delete.onDeleted,
      error: errorHandler
    });
  },

  onRate(rate) {
    const Vote = Parse.Object.extend('Vote');
    const me = Parse.User.current();
    const {movie} = this.props;
    const {votes, onRated, movieSession} = this.props.rate;
    const vote = votes.filter(v => v.attributes.user.id === me.id && v.attributes.movie.id === movie.id)[0] || new Vote();

    vote.set('user', me);
    vote.set('movie', movie);
    vote.set('vote', rate);
    vote.set('movieSession', movieSession);
    vote.save(null, {
      success: onRated,
      error: errorHandler
    });
  },

  isMine() {
    return this.props.movie.attributes.user.id === Parse.User.current().id;
  },

  getRating() {
    if (this.props.rate) {
      const {movie} = this.props;
      const {votes} = this.props.rate;
      const me = Parse.User.current();
      const vote = votes.filter(v => v.attributes.user.id === me.id && v.attributes.movie.id === movie.id)[0];
      return (
        <Rating
          onRate={this.onRate}
          rating={vote ? vote.attributes.vote : undefined}
          hints={['1', '2', '3', '4', '5']}
          icon='empty star icon'
          iconActive='star icon'
          iconSelected='star icon'
          />
      );
    }
  },

  getReviews() {
    const {imdbRating, tomatoMeter} = this.props.movie.attributes;
    return [
      {
        logo: 'https://lh6.ggpht.com/BFD_zfFU4xN17xVdmkpqs05oyU2o0JT0gBZhyQD4xBAs0AaXbpZQBJIun95GHhwgC6U=w170',
        rate: imdbRating
      },
      {
        logo: 'http://d3biamo577v4eu.cloudfront.net/static/images/trademark/fresh.png',
        rate: tomatoMeter + '%'
      }
    ].map((review, i) => <Review {...review} key={i} />);
  },

  render() {
    const {
      title,
      year,
      imdbID,
      // poster,
      plot,
      runtime
    } = this.props.movie.attributes;
    return (
      <div className='card'>
        <div className='image'>
          <img src={this.state.src} id={imdbID}/>
        </div>
        <div className='content'>
          <div className='header'>
            <a href={`http://www.imdb.com/title/${imdbID}/`} style={{color: '#242424'}}>{title}</a>
            <span className='date'>{year}</span>
          </div>
          <div className='meta'>
            <span className='date'>{runtime}</span>
          </div>
          <p>{plot}</p>
          <div className='reviews'>
            {this.getReviews()}
          </div>
          <div className='extra'>
            {this.getRating()}
          </div>
          {this.props.delete && <div className='delete-card' onClick={this.delete}>Delete card</div>}
        </div>
      </div>
    );
  }

});