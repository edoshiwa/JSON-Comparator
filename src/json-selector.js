import { Menu, Dropdown, Divider } from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { DragDropContext } from "react-beautiful-dnd";
import React from "react";
import Table from "./Table.js";
import "./App.css";
//DONE header plutot thead
//TODO gestion erreur
//DONE découpé en haut
//DONE auto refresh - quand dropdown ouvre fetch
//TODO C#
//TODO Groupage JSON
//Verification JSON
//Input serveur distant
//DONE déplacé colonne
//DONE promises readfile
var uniqid = require("uniqid");
const localUrl = "http://localhost/benchmark/";
const apiUrl = "comparator/api.php";
const urlParameters = "?name=";

class JsonSelector extends React.Component {
  constructor(props) {
    super();

    this.onClick = this.onClick.bind(this);
    this.deleteJson = this.deleteJson.bind(this);
    this.swapJson = this.swapJson.bind(this);
    this.fetchJsonList = this.fetchJsonList.bind(this);
    this.handlefile = this.handlefile.bind(this);
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
    } else this.setState({ menu: this.updateMenu(this.state.jsonFileName) });
  };
  componentDidMount() {
    this.fetchJsonList();
  }

  updateMenu(arr) {
    return (
      <Menu onClick={this.onClick}>
        {arr.map((element, index) => (
          <Menu.Item
            key={index}
            title={element}
            disabled={
              this.state.jsonArrayHeader.includes(element) ? true : false
            }
          >
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
  deleteJson = (key) => {
    console.log("deleting : " + key);
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
  handlefile = async (e) => {
    for (let index = 0; index < e.target.files.length; index++) {
      let files = this.state.jsonArray;
      let filesName = this.state.jsonArrayHeader;
      filesName.push(
        e.target.files[index].name.split(".").slice(0, -1).join(".")
      );

      let reader = new FileReader();
      reader.onloadend = (e) => {
        const jsonTest = JSON.parse(e.target.result);
        files.push(jsonTest);
        this.setState({ jsonArray: files, jsonArrayHeader: filesName });
      };
      reader.readAsText(e.target.files[index]);
    }
  };
  onDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    let arr = this.state.jsonArray;
    let header = this.state.jsonArrayHeader;

    let tmp = arr[source.index];
    arr.splice(source.index, 1);
    arr.splice(destination.index, 0, tmp);

    let tmp2 = header[source.index];
    header.splice(source.index, 1);
    header.splice(destination.index, 0, tmp2);
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
                Select JSON from server <DownOutlined />
              </a>
            </Dropdown>
            <label htmlFor="dirpicker" className="input-btn">
              Select local JSON directory <UploadOutlined />
            </label>
            <input
              type="file"
              id="dirpicker"
              name="fileList"
              directory=""
              webkitdirectory=""
              onChange={(e) => this.handlefile(e)}
            />
            <label htmlFor="filepicker" className="input-btn">
              Select local JSON file(s) <UploadOutlined />
            </label>
            <input
              type="file"
              id="filepicker"
              name="fileList"
              multiple=""
              accept=".json"
              onChange={(e) => this.handlefile(e)}
            />
          </div>
          <Divider />
          <div id="second">
            <DragDropContext onDragEnd={this.onDragEnd}>
              {
                <Table
                  key={uniqid()}
                  thead={this.state.jsonArrayHeader}
                  jsons={this.state.jsonArray}
                  deleteJson={this.deleteJson}
                  swapJson={this.swapJson}
                />
              }
            </DragDropContext>
          </div>
        </div>
      </div>
    );
  }
}
export default JsonSelector;
