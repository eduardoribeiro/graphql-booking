import React, { Component } from 'react';
import axios from 'axios';

import './Auth.css';
import AuthContext from '../context/auth-context';

class Auth extends Component {
  state = {
    isLogin: true,
    authError: ''
  };

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {
        isLogin: !prevState.isLogin
      };
    });
  };

  submitHandler = async event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      throw new Error('Empty input!');
    }

    let body = JSON.stringify({
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    });

    if (!this.state.isLogin) {
      body = JSON.stringify({
        query: `
          mutation {
            createUser(userInput: {
              email: "${email}",
              password: "${password}"
            }) {
              _id 
              email
            }
          }
        `
      });
    }

    const headers = {
      'Content-Type': 'application/json'
    };

    await axios
      .post('http://localhost:5000/api', body, {
        headers: headers
      })
      .then(res => {
        if (res.status === 500) {
          this.setState({ authError: res.errors[0].message });
          console.log('res.errors[0].message');
        }
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Can not register user!');
        }

        if (res.data.data.login.token) {
          this.context.login(
            res.data.data.login.token,
            res.data.data.login.userId,
            res.data.data.login.tokenExpiration
          );
        }
        console.log(res);
      })
      .catch(err => {
        console.error(err);
        this.setState({
          authError: 'Wrong email or password!'
        });
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h1>{this.state.isLogin ? 'Login!' : 'Signup!'}</h1>
        {this.state.authError && <p>{this.state.authError}</p>}
        <div className="form-control">
          <label htmlFor="email">E-mail</label>
          <input type="email" id="email" ref={this.emailEl} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={this.passwordEl} />
        </div>
        <div className="form-actions">
          <button className="btn btn-green" type="submit">
            Submit
          </button>
          <button
            className="switch"
            type="button"
            onClick={this.switchModeHandler}
          >
            Switch to {this.state.isLogin ? 'SignUp!' : 'Login!'}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
