import React from 'react/addons';

export default React.createClass({

  propTypes: {
    movie: React.PropTypes.object.isRequired,
    rating: React.PropTypes.number
  },

  render() {
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
          <a className='header'>Team Fu</a>
          <div className='meta'>
            <span className='date'>Create in Sep 2014</span>
          </div>
        </div>
        <div className='extra'>
          Rating:
          <div className='ui star rating' data-rating='5'></div>
        </div>
      </div>
    );
  }

});