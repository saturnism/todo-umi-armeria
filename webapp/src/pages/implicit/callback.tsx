import React, { Component } from 'react';
import { Redirect } from 'react-router';
// @ts-ignore
import { withAuth } from '@okta/okta-react';
import { connect } from 'dva';


export default connect()(withAuth(class ImplicitCallback extends Component {
  constructor(props) {
    super(props);

    this.state = {
      authenticated: null,
      error: null
    };
  }

  componentDidMount() {
    this.props.auth.handleAuthentication()
      .then(() => {
        this.setState({ authenticated: true })
        this.props.auth.getUser().then((user) => {
          this.props.dispatch({
            type: 'login/loggedIn',
            payload: user,
          });
        }).catch(err => this.setState({ authenticated: false, error: err.toString() }))
      })
      .catch(err => this.setState({ authenticated: false, error: err.toString() }));
  }

  render() {
    if (this.state.authenticated === null) {
      return null;
    }

    const referrerKey = 'secureRouterReferrerPath';
    const location = JSON.parse(localStorage.getItem(referrerKey) || '{ "pathname": "/" }');
    localStorage.removeItem(referrerKey);

    return this.state.authenticated ?
      <Redirect to={location}/> :
      <p>{this.state.error}</p>;
  }
}));

