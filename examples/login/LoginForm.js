import React from 'react/addons';
import errorHandler from '../errorHandler';

export default React.createClass({

  propTypes: {
    onSuccess: React.PropTypes.func.isRequired
  },

  mixins: [React.addons.LinkedStateMixin],

  getInitialState() {
    return {
      username: '',
      password: '',
      loading: false
    };
  },

  componentDidMount() {
    this.setState({
      username: 'francesco',
      password: '040691'
    }, this.login);
  },

  login() {
    const { setLoading } = this;
    const { onSuccess } = this.props;
    setLoading(true);
    const { username, password } = this.state;
    Parse.User.logIn(username, password, {
      success: (user) => {
        onSuccess();
      },
      error: function(user, error) {
        setLoading(false);
        errorHandler(error);
      }
    });
  },

  signup() {
    const { setLoading } = this;
    const { onSuccess } = this.props;
    setLoading(true);
    const user = new Parse.User();
    const { username, password } = this.state;
    user.set('username', username);
    user.set('password', password);

    user.signUp(null, {
      success: function(user) {
        onSuccess();
      },
      error: function(user, error) {
        setLoading(false);
        errorHandler(error);
      }
    });
  },

  setLoading(loading) {
    this.setState({loading});
  },

  render() {
    const loading = this.props.loading ? ' loading' : '';
    return (
      <form className={`ui form ${loading}`}>
        <div className='field'>
          <label>Username</label>
          <div className='ui left icon input'>
            <input placeholder='username' name='username' valueLink={this.linkState('username')}/>
            <i className='user icon'></i>
          </div>
        </div>
        <div className='field'>
          <label>Password</label>
          <div className='ui left icon input'>
            <input type='password' placeholder='password' name='password' valueLink={this.linkState('password')}/>
            <i className='lock icon'></i>
          </div>
        </div>
        <div className='ui blue submit button' onClick={this.login}>Login</div>
        <div className='ui submit button' onClick={this.signup}>Signup</div>
      </form>
    );
  }

});