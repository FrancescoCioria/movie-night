import React from 'react/addons';
import errorHandler from '../errorHandler';

export default React.createClass({

  propTypes: {
    onLogin: React.PropTypes.func.isRequired,
    onLogout: React.PropTypes.func.isRequired
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
    this.autoLogin();
  },

  autoLogin() {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    if (username && password) {
      this.setState({username, password}, this.login);
    }
  },

  login() {
    const { setLoading } = this;
    const { onLogin, onLogout } = this.props;
    setLoading(true);
    const { username, password } = this.state;
    Parse.User.logIn(username, password, {
      success: () => {
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        onLogin();
      },
      error: (user, error) => {
        onLogout();
        setLoading(false);
        errorHandler(user, error);
      }
    });
  },

  signup() {
    const { setLoading } = this;
    const { onLogin } = this.props;
    setLoading(true);
    const user = new Parse.User();
    const { username, password } = this.state;
    user.set('username', username);
    user.set('password', password);

    user.signUp(null, {
      success: onLogin,
      error: (user, error) => {
        setLoading(false);
        errorHandler(user, error);
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