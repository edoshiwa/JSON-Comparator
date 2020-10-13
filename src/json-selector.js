import { Menu, Dropdown, Divider } from "antd";
import { DownOutlined } from "@ant-design/icons";
import React from "react";
import Table from "./Table.js";
import "./App.css";
//DONE header plutot thead
//TODO gestion erreur
//DONE découpé en haut
//DONE auto refresh - quand dropdown ouvre fetch
//TODO C#
//DONE déplacé colonne
var uniqid = require("uniqid");
const localUrl = "http://localhost/benchmark/";
const apiUrl = "comparator/api.php";
const urlParameters = "?name=";
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
    this.deleteJson = this.deleteJson.bind(this);
    this.swapJson = this.swapJson.bind(this);
    this.fetchJsonList = this.fetchJsonList.bind(this);

    this.state = {
      menu: [],
      jsonFileName: [],
      lastJsonFetch: null,
      jsonArray: [],
      jsonArrayHeader: [],
    };
  }
  fetchJsonList = () => {
    if (
      this.state.lastJsonFetch == null ||
      Date.now() - this.state.lastJsonFetch > 5000
    ) {
      fetch(localUrl + apiUrl)
        .then((response) => response.json())
        .then((res) =>
          this.setState({
            menu: this.updateMenu(res),
            jsonFileName: res,
            lastJsonFetch: Date.now(),
          })
        );
      console.log(Date.now() + "fetching...");
    }
    else this.setState({menu: this.updateMenu(this.state.jsonFileName)});
  };
  componentDidMount() {
    this.fetchJsonList();
  }

  updateMenu(arr) {
    return (
      <Menu onClick={this.onClick}>
        {arr.map((element, index) => (
          <Menu.Item key={index} title={element} disabled={(this.state.jsonArrayHeader.includes(element)?true:false)}>
            {element}
          </Menu.Item>
        ))}
      </Menu>
    );
  }
  onClick = ({ key }) => {
    fetch(
      (localUrl + apiUrl + urlParameters).concat(this.state.jsonFileName[key])
    )
      .then((response) => response.json())
      .then((res) => {
        let arr = this.state.jsonArray.concat(res);
        let arrThead = this.state.jsonArrayHeader.concat(
          this.state.jsonFileName[key]
        );
        this.setState({ jsonArray: arr, jsonArrayHeader: arrThead });
      });
    //message.info(`Click on item ${this.state.jsonName[key]}`);
  };
  deleteJson = ( key ) => {
    console.log("deleting : "+key);
    let arr = this.state.jsonArray;
    arr.splice(key, 1);
    let header = this.state.jsonArrayHeader;
    header.splice(key, 1);
    this.setState({ jsonArray: arr, jsonArrayHeader: header });
  };
  swapJson = (firstIndex, secondIndex) => {
    let arr = this.state.jsonArray;
    let header = this.state.jsonArrayHeader;
    let tmp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = tmp;

    tmp = header[firstIndex];
    header[firstIndex] = header[secondIndex];
    header[secondIndex] = tmp;

    this.setState({ jsonArray: arr, jsonArrayHeader: header });
  };

  render() {
    return (
      <div>
        <h1>Benchmark comparator</h1>
        <Divider />
        <div id="Wrapper">
          <div id="first">
            <Dropdown
              overlay={this.state.menu}
              onVisibleChange={() => this.fetchJsonList()}
            >
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                Select JSON <DownOutlined />
              </a>
            </Dropdown>
            <form onSubmit={this.handleSubmit}>
        <label>
          Envoyer un fichier :
          <input type="file" ref={this.fileInput} />
        </label>
      </form>
          </div>
          <div id="second">
            <Table
              key={uniqid()}
              thead={this.state.jsonArrayHeader}
              jsons={this.state.jsonArray}
              deleteJson={this.deleteJson}
              swapJson={this.swapJson}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default JsonSelector;
