import { Menu, Dropdown, message } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React from "react";
import Table from "./Table.js";
import "./App.css";

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
      tableData2: {
        thead: ["Description", "Fichier 1", "Fichier 2"],
        bench: [
          {
            description:
              "Creating array of 100 000 random strings that are 14 chars long",
            time: 33089200,
            space: 10291536,
            id: "b_arr_str_low",
          },
          {
            description:
              "Creating array of 1 000 000 random strings that are 14 chars long",
            time: 402681600,
            space: 75651664,
            id: "b_arr_str_high",
          },
          {
            description:
              "Creating array of 1 000 000 random int with a for loop",
            time: 169651800,
            space: 35651664,
            id: "b_arr_int_for",
          },
          {
            description:
              "Creating array of 1 000 000 random int with a for loop",
            time: 7493300,
            space: 35651664,
            id: "b_arr_int_fill",
          },
          {
            description:
              "Creating associative array of 500 000 int with key strings that are 14 chars long",
            time: 359065400,
            space: 40942200,
            id: "b_asso_array",
          },
          {
            description:
              "Creating 100 000 objects with 7 properties (3 Strings that are 14 chars long and \r\n                      4 int) and dynamically add one string property to each that are 14 chars long",
            time: 246556100,
            space: 26531920,
            id: "b_obj",
          },
        ],
        bench2: [
          {
            description:
              "RAND Creating array of 100 000 random strings that are 14 chars long",
            time: 51740100,
            space: 10291536,
            id: "b_arr_str_low2",
          },
          {
            description:
              "RAND Creating array of 1 000 000 random strings that are 14 chars long",
            time: 571318400,
            space: 75651664,
            id: "b_arr_str_high2",
          },
          {
            description:
              "Creating print of 3 000 000 random person that are not long",
            time: 1271318400,
            space: 27651664,
            id: "b_strong",
          },
        ],
      },
    };
  }
  componentDidMount() {
    fetch("http://localhost/benchmark/comparator/api.php")
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
      "http://localhost/benchmark/comparator/api.php?name=".concat(
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
      <div id="Wrapper">
        <div id="first">
          <Table
            key={uniqid()}
            thead={this.state.jsonsThead}
            tableData={this.state.tableData2}
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
    );
  }
}
export default JsonSelector;
/*ReactDOM.render(
  <Dropdown overlay={menu}>
    <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
      Hover me, Click menu item <DownOutlined />
    </a>
  </Dropdown>,
  mountNode
);*/
