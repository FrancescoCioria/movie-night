import React from 'react/addons';
import errorHandler from '../errorHandler';
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
    }).isRequired,
    rate: React.PropTypes.shape({
      votes: React.PropTypes.array.isRequired,
      onRated: React.PropTypes.func.isRequired
    }),
    delete: React.PropTypes.shape({
      onDeleted: React.PropTypes.func.isRequired
    })
  },

  delete() {
    this.props.movie.destroy({
      success: this.props.onDeleted,
      error: errorHandler
    });
  },

  onRate(rate) {
    const Vote = Parse.Object.extend('Vote');
    const me = Parse.User.current();
    const {movie} = this.props;
    const {votes, onRated} = this.props.rate;
    const vote = votes.filter(v => v.attributes.user.id === me.id && v.attributes.movie.id === movie.id)[0] || new Vote();

    vote.set('user', me);
    vote.set('movie', movie);
    vote.set('vote', rate);
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
        <div className='image'>
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
          {this.props.delete && <div className='delete-card' onClick={this.delete}>Delete card</div>}
        </div>
      </div>
    );
  }

});