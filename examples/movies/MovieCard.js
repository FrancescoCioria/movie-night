import React from 'react/addons';

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
        runtime: React.PropTypes.string.isRequired
      }).isRequired,
    }),
    rating: React.PropTypes.number
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
        </div>
        <div className='extra'>
          Rating:
          <div className='ui star rating' data-rating='5'></div>
        </div>
      </div>
    );
  }

});