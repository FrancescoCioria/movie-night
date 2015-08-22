import React from 'react';

export default React.createClass({

  propTypes: {
    logo: React.PropTypes.string.isRequired,
    rate: React.PropTypes.string.isRequired
  },

  render() {
    const {logo, rate} = this.props;
    return (
      <div className='review'>
        <img src={logo} />
        <span>{rate}</span>
      </div>
    );
  }

});