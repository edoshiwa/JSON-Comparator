import { Menu, Dropdown, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React from "react";
import Table from "./Table.js";
import "./App.css";
//TODO header plutot thead
//TODO gestion erreur
//TODO url découpé en haut
//TODO auto refresh - quand dropdown ouvre fetch
//TODO C#
//TODO déplacé colonne
var uniqid = require("uniqid");

/*const menu = (
  <Menu onClick={onClick}>
    <Menu.Item key="1">1st menu item</Menu.Item>
    <Menu.Item key="2">2nd memu item</Menu.Item>
    <Menu.Item key="3">3rd menu item</Menu.Item>
  </Menu>
);*/

class JsonSelector extends React.Component {
  constructor(props) {
    super();
    this.onClick = this.onClick.bind(this);
    this.state = {
      menu: [],
      jsonName: [],
      jsons: Array(),
      jsonsThead: [],
    };
  }
  componentDidMount() {
    fetch("http://localhost/us987/comparator/api.php")
      .then((response) => response.json())
      .then((res) =>
        this.setState({ menu: this.updateMenu(res), jsonName: res })
      );
  }
  updateMenu(arr) {
    return (
      <Menu onClick={this.onClick}>
        {arr.map((element, index) => (
          <Menu.Item key={index} title={element}>
            {element}
          </Menu.Item>
        ))}
      </Menu>
    );
  }
  onClick = ({ key }) => {
    fetch(
      "http://localhost/us987/comparator/api.php?name=".concat(
        this.state.jsonName[key]
      )
    )
      .then((response) => response.json())
      .then((res) => {
        let arr = this.state.jsons.concat(res);
        let arrThead = this.state.jsonsThead.concat(this.state.jsonName[key]);
        this.setState({ jsons: arr, jsonsThead: arrThead });
      });
    //message.info(`Click on item ${this.state.jsonName[key]}`);
  };
  render() {
    return (
      <div>
        <h1>Benchmark comparator</h1>
        <Divider />
        <div id="Wrapper">
          <div id="first">
            <Table
              key={uniqid()}
              thead={this.state.jsonsThead}
              jsons={this.state.jsons}
            />
          </div>
          <div id="second">
            <Dropdown overlay={this.state.menu}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                Select JSON <DownOutlined />
              </a>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
}
export default JsonSelector;
