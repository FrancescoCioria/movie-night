import React from 'react/addons';
import errorHandler from '../errorHandler';

export default React.createClass({

  propTypes: {
    movieSession: React.PropTypes.object.isRequired,
    onNewSession: React.PropTypes.func.isRequired
  },

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      minutes: 30
    };
  },

  startNewSession() {
    const {movieSession} = this.props;
    const endingAt = new Date(Date.now() + (1000 * 60 * parseInt(this.state.minutes)));
    movieSession.set('active', false);
    movieSession.save();

    const MovieSession = Parse.Object.extend('MovieSession');
    const newMovieSession = new MovieSession();

    newMovieSession.set('endingAt', endingAt);
    newMovieSession.set('active', true);

    newMovieSession.save(null, {
      success: this.props.onNewSession,
      error: errorHandler
    });
  },

  render() {
    return (
      <div className='ui segment start-new-session'>
        <form className='ui form'>
          <label>Countdown timer (minutes from now)</label>
          <div className='field'>
            <input type='number' valueLink={this.linkState('minutes')}/>
          </div>
          <div className='ui submit green button' onClick={this.startNewSession}>
            START A NEW SESSION
          </div>
        </form>
      </div>
    );
  }

});