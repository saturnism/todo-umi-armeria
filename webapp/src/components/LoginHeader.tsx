import React, {Component} from 'react';

import { connect } from 'dva';

// @ts-ignore
import { withAuth } from '@okta/okta-react';
import {Link} from "umi";
import {Dropdown, Menu} from "antd";

type LoginHeaderProp = {
  login: any,
  dispatch: any,
  auth: any,
}

type LoginHeaderState = {
}

const header = withAuth(class LoginHeader extends Component<LoginHeaderProp, LoginHeaderState> {
  constructor(props : LoginHeaderProp) {
    super(props);
    this.checkAuthentication = this.checkAuthentication.bind(this)
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  async checkAuthentication() {
    const user = await this.props.auth.getUser()
    if (user) {
      this.props.dispatch({
        type: 'login/loggedIn',
        payload: user,
      });
    }
  }

  async componentDidMount() {
    this.checkAuthentication();
  }

  async login() {
    // Redirect to '/' after login
    this.props.auth.login('/');
  }

  async logout() {
    // Redirect to '/' after logout
    await this.props.auth.logout('/');
    this.props.dispatch({
        type: 'login/loggedOut',
      });
  }

  render() {
    if (this.props.login.loggedIn) {
      const menu = (
        <Menu>
          <Menu.Item>
            <Link to='#' onClick={this.logout}>Logout</Link>
          </Menu.Item>
        </Menu>
      )
      return (
        <Dropdown
          overlay={menu}
          trigger={['click']}
          placement="bottomLeft"
        >
          <span>{this.props.login.user.name}</span>
        </Dropdown>
      )
    } else {
      return <Link to='#' onClick={this.login}>Login</Link>
    }
  }
});


export default connect(({ login }) => ({ login }))(header);
