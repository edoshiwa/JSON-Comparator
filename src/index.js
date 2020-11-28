import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.js";
import BenchES from "./BenchES";
import { Layout, Menu } from "antd";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
const { Header, Content } = Layout;

ReactDOM.render(
  <Router>
    <Layout className="layout">
      <Header style={{ backgroundColor: "#FFFFFF" }}>
        <Menu
          mode="horizontal"
          className="button-nav"
          style={{
            float: "right",
            borderBottom: "none",
          }}
        >
          <Menu.Item key="1" style={{ borderBottom: "none" }}>
            <Link to="/">Benchmark Comparator</Link>
          </Menu.Item>
          <Menu.Item key="2" style={{ borderBottom: "none" }}>
            <Link to="/js">JS Benchmark</Link>
          </Menu.Item>
          <Menu.Item key="3" style={{ borderBottom: "none" }}>
            <Link to="/php">PHP Benchmark</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ backgroundColor: "#FFFFFF" }}>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/js">
            <BenchES />
          </Route>
        </Switch>
      </Content>
    </Layout>
  </Router>,
  document.getElementById("root")
);
