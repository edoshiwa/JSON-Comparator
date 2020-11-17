/* eslint-disable no-invalid-this */
import { Menu, Dropdown, Divider, Switch, Slider, Row, Col } from "antd";
import { DownOutlined, UploadOutlined } from "@ant-design/icons";
import { DragDropContext } from "react-beautiful-dnd";
import schema from "./json-schema.json";
import Ajv from "ajv";
import React from "react";
import Table from "./Table.js";
import "./App.css";

const uniqid = require("uniqid");
const webSocketUrl = "ws://localhost:8080/";
const localUrl = "http://localhost/easyvista_training/";
const apiUrl = "comparator/api.php";
const urlParameters = "?name=";
/**
 * App class
 */
class App extends React.Component {
  // Init WebSocket connection

  /**
   * Bind the following functions :
   * @function this.onClick : Called when an item is clicked in the menu
   * @function this.deleteJson : Called when delete button is clicked
   * @function this.swapJson : Called when swap arrow are clicked
   * @function this.fetchJsonList : Called when menu isDirty
   * @function this.handleUploadedFiles : Called when a file is upload into the webpage
   *
   * Init the following states */
  /**
   * @param {*} props
   * @property {array} menu : Array of MenuItem
   * @property {array} jsonFileName : Array of String reprensenting JSON filename without extension
   * @property {boolean} menuIsDirty : Represent if the menu need to be updated
   * @property {number} lastTimeFetched : Represent last time timestamp of fetch
   * @property {array} jsonArray : Array of fetched JSON files, order matter
   * @property {array} jsonArrayHeader : Name of file in jsonArray, order matter
   */
  constructor(props) {
    super();
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleDisabledChange = this.handleDisabledChange.bind(this);
    this.updateMap = this.updateMap.bind(this);
    this.onClick = this.onClick.bind(this);
    this.deleteJson = this.deleteJson.bind(this);
    this.swapJson = this.swapJson.bind(this);
    this.fetchJsonList = this.fetchJsonList.bind(this);
    this.handleUploadedFiles = this.handleUploadedFiles.bind(this);
    this.state = {
      menu: [],
      jsonFileName: [],
      benchIdMap: [],
      menuIsDirty: true,
      lastTimeFetch: null,
      jsonArray: [],
      jsonArrayHeader: [],
      showGradient: false,
      comparisonMargin: 99,
    };
  }
  /**
   * When component is mount
   * And fetch JSON list to update menu.
   * It call:
   * this.fetchJsonList : And fetch JSON list to update menu.
   * this.websocketServer.onopen : when the connection is made with the WSS
   * this.websocketServer.onmessage : when the WSS connection receive message from other client
   * this.websocketServer.onerror : when the connection encounter an error
   * this.websocketServer.onclose : when the connection is closed
   */
  componentDidMount() {
    this.websocketServer = new WebSocket(webSocketUrl);
    this.fetchJsonList();
    this.websocketServer.onopen = () => {
      this.websocketServer.send(
        JSON.stringify({
          type: "listener",
          user_id: uniqid(),
        })
      );
    };
    this.websocketServer.onmessage = (evt) => {
      const message = JSON.parse(evt.data);
      console.log(message);
      this.setState({ menuIsDirty: true });
    };
    this.websocketServer.onerror = (evt) => {
      console.error(
        "Socket encountered error: ",
        evt.message,
        "Closing socket"
      );
      this.websocketServer.close();
    };
    this.websocketServer.onclose = (evt) => {
      console.log(
        "Socket is closed. Reconnect will be attempted in 1 second.",
        evt.reason
      );
      setTimeout(function () {
        this.websocketServer = new WebSocket(webSocketUrl);
      }, 1000);
    };
  }
  /**
   * It will fetch the from the set Api the selected file
   * @param {number} key : index of element in dropdown
   * @callback this.setState() : it will update the state by adding the new Json
   * and its file to respectively jsonArray and jsonArrayHeader
   */
  onClick = ({ key }) => {
    fetch(
      (localUrl + apiUrl + urlParameters).concat(this.state.jsonFileName[key])
    )
      .then((response) => response.json())
      .then(
        (res) => {
          const arr = this.state.jsonArray.concat(res);
          const arrThead = this.state.jsonArrayHeader.concat(
            this.state.jsonFileName[key]
          );
          this.setState({
            jsonArray: arr,
            jsonArrayHeader: arrThead,
            benchIdMap: this.updateMap(arr),
          });
        },
        (error) => {
          this.setState({ menuIsDirty: true });
          this.fetchJsonList();
          alert(
            "There was an error : " +
              error +
              " while fetching please try again."
          );
        }
      );
  };
  /**
   * It will update the state of the class by deleting
   * a JSON and its corresponding title, in both
   * jsonArray and jsonArrayHeader states.
   * @param {number} key : index of element in jsonArray or jsonArrayHeader
   */
  deleteJson = (key) => {
    const arr = this.state.jsonArray;
    arr.splice(key, 1);
    const header = this.state.jsonArrayHeader;
    header.splice(key, 1);
    this.setState({
      jsonArray: arr,
      jsonArrayHeader: header,
      benchIdMap: this.updateMap(arr),
    });
  };
  /**
   * It will swap in state two JSON and their corresponding title.
   * @param {number} firstIndex the index of the first JSON
   * @param {number} secondIndex the index of the second JSON
   */
  swapJson = (firstIndex, secondIndex) => {
    const arr = this.state.jsonArray;
    const header = this.state.jsonArrayHeader;
    let tmp = arr[firstIndex];
    arr[firstIndex] = arr[secondIndex];
    arr[secondIndex] = tmp;

    tmp = header[firstIndex];
    header[firstIndex] = header[secondIndex];
    header[secondIndex] = tmp;

    this.setState({ jsonArray: arr, jsonArrayHeader: header });
  };
  /**
   * Fetch again the JSON list if menuIsDirty or if the WSS connection is closed
   * and the menu hasn't been update in the last 5 second.
   * Else it will just refrech the Item Menu.
   */
  fetchJsonList = () => {
    if (
      this.state.menuIsDirty === true ||
      this.state.lastTimeFetch == null ||
      (this.websocketServer.readyState === WebSocket.CLOSED &&
        Date.now() - this.state.lastTimeFetch > 5000)
    ) {
      console.log("Fetching...");
      fetch(localUrl + apiUrl)
        .then((response) => response.json())
        .then(
          (res) => {
            this.setState({
              menu: this.updateMenu(res),
              jsonFileName: res,
              lastTimeFetch: Date.now(),
              menuIsDirty: false,
            });
          },
          (error) => {
            alert(
              "There was an error : " +
                error +
                " while fetching please try again."
            );
          }
        );
    } else this.setState({ menu: this.updateMenu(this.state.jsonFileName) });
  };
  /**
   * Update Menu item with a list of JSON filenames
   * @param {*} arr : JSON filenames
   * @return {*} a new menu
   */
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
  /**
   * Handle file that are pass into the browser.
   * Everything happend locally. It will save them the same way
   * as there way fetched via api.
   * @param {*} e change event from file upload selector
   */
  handleUploadedFiles = async (e) => {
    for (let index = 0; index < e.target.files.length; index++) {
      const files = this.state.jsonArray;
      const filesName = this.state.jsonArrayHeader;
      // push file name into the array without the .json extension
      filesName.push(
        e.target.files[index].name.split(".").slice(0, -1).join(".")
      );
      // Create a file reader
      const reader = new FileReader();
      // the callback function will be use when readAsText is called
      reader.onloadend = (e) => {
        const jsonTest = JSON.parse(e.target.result);

        const ajv = new Ajv();
        const validate = ajv.compile(schema);
        const valid = validate(jsonTest);
        console.log("est valide : " + valid);
        if (!valid) console.log(validate.errors);
        else {
          files.push(jsonTest);
          this.setState({
            jsonArray: files,
            jsonArrayHeader: filesName,
            benchIdMap: this.updateMap(files),
          });
          // this.updateMap();
        }
      };
      reader.readAsText(e.target.files[index]);
    }
  };
  /**
   * Callback function when a draggable has been dropped in a droppable area
   * @param {*} result data about the DnD context
   */
  onDragEnd = (result) => {
    const { destination, source } = result;
    // if there is no destination, there is no change to do
    if (!destination) {
      return;
    }
    // if the destination is the source, there is no change to do
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }
    // We want to shift the dragged element at the right destination
    // We save the current state
    const arr = this.state.jsonArray;
    const header = this.state.jsonArrayHeader;
    // We save the dragged element in a tmp value
    const tmp = arr[source.index];
    // We delete the dragged element from the saved current state
    arr.splice(source.index, 1);
    // We push the dragged element at the right destination in the saved current state
    arr.splice(destination.index, 0, tmp);

    // same thing for the title
    const tmp2 = header[source.index];
    header.splice(source.index, 1);
    header.splice(destination.index, 0, tmp2);
    // we update the state and the component refresh
    this.setState({ jsonArray: arr, jsonArrayHeader: header });
  };
  /**
   * Update the map state. The map contains all the id of charged benchmark
   * @param {*} arr
   * @return {*} a Map of unique id of benchmark in all jsons
   */
  updateMap = (arr) => {
    const mapTmp = new Map();
    arr.forEach((el) => {
      for (const benchmark in el.bench) {
        if (!mapTmp.has(el.bench[benchmark].id)) {
          // console.log("id" + el.bench[benchmark].id);
          // console.log("des" + el.bench[benchmark].description);
          mapTmp.set(el.bench[benchmark].id, el.bench[benchmark].description);
        }
      }
    });
    console.log("update map : ");
    // mapTmp.forEach((element) => console.log(element));
    return mapTmp;
  };
  /**
   * Handle change in the trigger button
   * @param {*} disabled state of the button
   */
  handleDisabledChange = (disabled) => {
    this.setState({ showGradient: disabled });
  };
  /**
   * Handler change in the slider
   * @param {*} value of the slider
   */
  handleSliderChange = (value) => {
    this.setState({ comparisonMargin: value });
  };
  /*
   * The render function can be divided in 3 parts
   * 1. The title
   * 2. div first: contains all JSON input (from a server or from local disk)
   * 3. div second: contains TableList
   */
  /**
   * @return {*} the App div containing  file selection menu /  options / draggable table
   */
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
              onChange={(e) => this.handleUploadedFiles(e)}
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
              onChange={(e) => this.handleUploadedFiles(e)}
            />
          </div>
          <Divider />
          <div className="options">
            <Row>
              <Col>Comparison type :</Col>
              <Col>
                <Switch
                  checked={this.state.showGradient}
                  onChange={this.handleDisabledChange}
                  checkedChildren="Wider Top and Bottom"
                  unCheckedChildren="Strict Top and Bottom"
                />
              </Col>
              <Col hidden={!this.state.showGradient}>Comparison margin :</Col>
              <Col span="4" hidden={!this.state.showGradient}>
                <Slider
                  min={51}
                  max={100}
                  defaultValue={this.state.comparisonMargin}
                  disabled={!this.state.showGradient}
                  onChange={this.handleSliderChange}
                />
              </Col>
              <Col hidden={!this.state.showGradient}>
                {this.state.comparisonMargin} %
              </Col>
            </Row>
          </div>

          <div id="second">
            <DragDropContext onDragEnd={this.onDragEnd}>
              {
                <Table
                  comparisonMargin={this.state.comparisonMargin}
                  showGradient={this.state.showGradient}
                  key={uniqid()}
                  thead={this.state.jsonArrayHeader}
                  jsons={this.state.jsonArray}
                  deleteJson={this.deleteJson}
                  swapJson={this.swapJson}
                  benchIdMap={this.state.benchIdMap}
                />
              }
            </DragDropContext>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
