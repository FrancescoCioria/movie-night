import React from 'react';
import range from 'lodash/utility/range';
import RatingIcon from './RatingIcon';

export default React.createClass({

  propTypes: {
    onRate:       React.PropTypes.func.isRequired,
    rating:       React.PropTypes.number,
    hints:        React.PropTypes.arrayOf(React.PropTypes.string),
    maxRating:    React.PropTypes.number,
    icon:         React.PropTypes.string,
    iconActive:   React.PropTypes.string,
    iconSelected: React.PropTypes.string,
    className:    React.PropTypes.string,
    loading:      React.PropTypes.bool,
    disabled:     React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      maxRating: 5,
      icon: 'star',
      className: ''
    };
  },

  getInitialState() {
    return {
      hoverIndex: undefined
    };
  },

  getLoader() {
    if (this.props.loading) {
      return (
        <div className='ui active inverted dimmer'>
          <div className='ui mini text loader'/>
        </div>
      );
    }
  },

  getRatingIcons() {
    return range(1, this.props.maxRating + 1).map((rating, i) =>
      <RatingIcon
        active={rating <= this.props.rating}
        selected={rating <= this.state.hoverIndex}
        onHover={this.setHoverIndex}
        onLeave={this.resetHover}
        onClick={this.onRate}
        hint={this.props.hints ? this.props.hints[i] : undefined}
        icon={this.props.icon}
        iconActive={this.props.iconActive || this.props.icon}
        iconSelected={this.props.iconSelected || this.props.icon}
        index={rating}
        disabled={this.props.disabled}
        key={i}
      />
    );
  },

  onRate(rate) {
    if (!this.props.disabled) {
      this.props.onRate(rate);
    }
  },

  setHoverIndex(hoverIndex) {
    if (!this.props.disabled) {
      this.setState({ hoverIndex });
    }
  },

  resetHover() {
    if (!this.props.disabled) {
      this.setState({ hoverIndex: undefined });
    }
  },

  render() {
    const selected = this.state.hoverIndex >= 0 ? 'selected' : '';
    const loading = this.props.loading ? 'loading' : '';
    return <div className={`ui rating react-semantic-rating ${this.props.className} ${selected} ${loading}`}>
            {this.getLoader()}
            {this.getRatingIcons()}
          </div>;
  }

});