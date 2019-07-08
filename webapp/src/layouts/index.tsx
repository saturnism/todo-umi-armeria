import React from 'react';

import { Layout, Menu, Breadcrumb } from 'antd';
import {Link} from "umi";
const { Header, Content, Footer } = Layout;

// @ts-ignore
import { Security } from '@okta/okta-react';
import oktaConfig from '@/utils/OktaConfig';
import LoginHeader from "@/components/LoginHeader";

const BasicLayout: React.FC = props => {
  return (
    <Security
      issuer={oktaConfig.issuer}
      client_id={oktaConfig.client_id}
      redirect_uri={oktaConfig.redirect_uri}
    >
    <Layout className="layout">
      <Header style={{padding: 0}}>
        <div className="logo" />
        <Menu
          theme="light"
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          style={{ padding: 0, width: '100%'}}
        >
          <Menu.Item key="/"><Link to="/">Home</Link></Menu.Item>

          <Menu.Item style={{ float: 'right' }}><LoginHeader/></Menu.Item>
        </Menu>

      </Header>
      <Content style={{ padding: 0 }}>
        <div style={{ background: '#fff', padding: 12, minHeight: 280 }}>
          {props.children}
        </div>
      </Content>
    </Layout>
    </Security>
  );
};

export default BasicLayout;
