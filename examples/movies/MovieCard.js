import React from 'react/addons';

export default React.createClass({

  propTypes: {
    movie: React.PropTypes.shape({
      attributes: React.PropTypes.shape({
        title: React.PropTypes.string.isRequired,
        imdbID: React.PropTypes.string.isRequired,
        year: React.PropTypes.number.isRequired
      }).isRequired,
    }),
    rating: React.PropTypes.number
  },

  render() {
    const {title, year} = this.props.movie.attributes;
    return (
      <div className='card'>
        <div className='blurring dimmable image'>
          <div className='ui dimmer'>
            <div className='content'>
              <p>breve descrizione</p>
            </div>
          </div>
          <img src='/images/avatar/large/elliot.jpg'/>
        </div>
        <div className='content'>
          <div className='header'>{title}</div>
          <div className='meta'>
            <span className='date'>{year}</span>
          </div>
          <p>This is a description</p>
        </div>
        <div className='extra'>
          Rating:
          <div className='ui star rating' data-rating='5'></div>
        </div>
      </div>
    );
  }

});