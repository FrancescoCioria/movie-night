import React from 'react';

export default React.createClass({

  propTypes: {
    onEnd: React.PropTypes.func,
    onTick: React.PropTypes.func,
    endDate: React.PropTypes.instanceOf(Date).isRequired,
    compact: React.PropTypes.bool
  },

  getInitialState() {
    return this.getStateFromProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    const oldSecondsRemaining = this.state.secondsRemaining;
    this.setState(
      this.getStateFromProps(nextProps),
      () => {
        if (oldSecondsRemaining === 0 && this.state.secondsRemaining > 0) {
          this.start();
        }
      }
    );
  },

  getStateFromProps(props) {
    const now = new Date();
    const secondsRemaining = Math.floor((props.endDate - now) / 1000);
    return {
      secondsRemaining: secondsRemaining > 0 ? secondsRemaining : 0
    };
  },

  componentDidMount() {
    this.start();
  },

  componentWillUnmount() {
    this.stop();
  },

  start() {
    this.interval = setInterval(this.tick, 1000);
  },

  stop() {
    clearInterval(this.interval);
  },

  tick() {
    this.setState(this.getStateFromProps(this.props), () => {
      if (this.state.secondsRemaining <= 0) {
        clearInterval(this.interval);
        if (this.props.onEnd) {
          this.props.onEnd();
        }
      } else if (this.props.onTick) {
        this.props.onTick();
      }
    });
  },

  getBlock(number, text) {
    return (
      <div className='countdown-block'>
        <h1 className='purple-text'>{!this.props.compact && number < 10 ? ('0' + number) : number}</h1>
        {!this.props.compact ? <p>{text}</p> : null}
      </div>
    );
  },

  getSpan(text) {
    return <span className={this.props.compact ? 'purple-text' : ''}>{text}</span>;
  },

  render() {
    const days = Math.floor(this.state.secondsRemaining / 60 / 60 / 24);
    const hours = Math.floor(this.state.secondsRemaining / 60 / 60 - days * 24);
    const minutes = Math.floor(this.state.secondsRemaining / 60 - (days * 24 + hours) * 60);

    return (
      <div className={this.props.compact ? 'compact countdown' : 'countdown'}>
        {this.getBlock(days, 'days')}
        {this.getSpan(this.props.compact ? 'd' : ':')}
        {this.getBlock(hours, 'hours')}
        {this.getSpan(this.props.compact ? 'h' : ':')}
        {this.getBlock(minutes, 'minutes')}
        {this.props.compact ? this.getSpan('m') : null}
      </div>
    );
  }

});