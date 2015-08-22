import React from 'react';
import partial from 'lodash/function/partial';

export default React.createClass({

  propTypes: {
    onHover: React.PropTypes.func.isRequired,
    onLeave: React.PropTypes.func.isRequired,
    onClick: React.PropTypes.func.isRequired,
    index: React.PropTypes.number.isRequired,
    icon: React.PropTypes.string.isRequired,
    iconActive: React.PropTypes.string.isRequired,
    iconSelected: React.PropTypes.string.isRequired,
    selected: React.PropTypes.bool.isRequired,
    active: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
    hint: React.PropTypes.string
  },

  componentDidMount() {
    if (this.props.hint && !this.props.disabled) {
      $(this.refs.icon.getDOMNode()).popup();
    }
  },

  render() {
    const {index} = this.props;
    const active = this.props.active ? 'active' : '';
    const selected = this.props.selected ? 'selected' : '';
    const disabled = this.props.disabled ? 'disabled' : '';
    let icon = this.props.icon;
    if (this.props.selected) {
      icon = this.props.iconSelected;
    } else if (this.props.active) {
      icon = this.props.iconActive;
    }
    return (
      <i
        className={`${icon} ${active} ${selected} ${disabled}`}
        onMouseOver={partial(this.props.onHover, index)}
        onMouseLeave={partial(this.props.onLeave, index)}
        onClick={partial(this.props.onClick, index)}
        data-content={this.props.hint}
        data-variation='inverted'
        data-position='top center'
        ref='icon'
      />
    );
  }

});