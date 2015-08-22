import React from 'react/addons';
import Rating from '../rating/Rating';

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
      }).isRequired,
    }),
    votes: React.PropTypes.array.isRequired,
    onRated: React.PropTypes.func.isRequired
  },

  onRate(rate) {
    const Vote = Parse.Object.extend('Vote');
    const me = Parse.User.current();
    const {movie, votes, onRated} = this.props;
    const vote = votes.filter(v => v.attributes.user.id === me.id && v.attributes.movie.id === movie.id)[0] || new Vote();

    vote.set('user', me);
    vote.set('movie', movie);
    vote.set('vote', rate);
    vote.save(null, {
      success: (vote) => {
        onRated(vote);
      },
      error: (movie, error) => {
        alert('Failed to rate movie with error code: ' + error.message);
      }
    });
  },

  getRating() {
    const {movie, votes} = this.props;
    const me = Parse.User.current();
    if (movie.attributes.user.id === me.id) {
      return false;
    }
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
  },

  render() {
    const {
      title,
      year,
      imdbRating,
      tomatoMeter,
      poster,
      plot,
      runtime
    } = this.props.movie.attributes;
    return (
      <div className='card'>
        <div className='blurring dimmable image'>
          <div className='ui dimmer'>
            <div className='content'>
              <p>breve descrizione</p>
            </div>
          </div>
          <img src={poster}/>
        </div>
        <div className='content'>
          <div className='header'>
            {title}
            <span className='date'>{year}</span>
          </div>
          <div className='meta'>
            <span className='date'>{runtime}</span>
          </div>
          <p>{plot}</p>
          <div className='extra'>
            {this.getRating()}
          </div>
        </div>
      </div>
    );
  }

});