/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */
import * as Benchmark from "./Bench.js";
import React from "react";
import { Divider, Popover, Tag, Alert, Button } from "antd";
import { RightCircleTwoTone, StopTwoTone } from "@ant-design/icons";
import { Table } from "./component/Table";
import styled from "styled-components";
import * as format from "./util";
import { ClockLoader } from "react-spinners";
import { LineChart, XAxis, YAxis, Tooltip, Legend, Line } from "recharts";
// Style for our table
const Styles = styled.div`
  overflow-x: auto;
  td {
    text-align: left;
  }
  table,
  td,
  th {
    border: 1px solid black;
  }
`;
// Style for our button
const LaunchButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? "radial-gradient(circle, rgba(0,125,130,0.50) 0%, rgba(0,157,99,0.50) 100%);"
      : "radial-gradient(circle, rgba(0,125,130,1) 0%, rgba(0,157,99,1) 100%);"};
  color: ${(props) => (props.disabled ? "#7f7f82" : "#ffffff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "auto")};
`;
// Resuable pending tag
const pending = <Tag color="gold">Pending</Tag>;
// Reuasble Spinner
const clockSpinner = <ClockLoader color="#007d82" size="25px" />;
// All available bench
const availableBench = Benchmark.Description;
// Table columns information to use in our Table component
const columns =
  "memory" in performance
    ? [
        { title: "Description", dataIndex: "description" },
        { title: "Time", dataIndex: "time" },
        { title: "Memory used", dataIndex: "size" },
        { title: "Memory graph", dataIndex: "graph" },
      ]
    : [
        { title: "Description", dataIndex: "description" },
        { title: "Time", dataIndex: "time" },
      ];
/**
 * A message error that is displayed if the user's browser doesn't support
 * the performance.memory API
 * @return {Object} An alert JSX Object
 */
const WarningDiv = () => {
  return (
    <Alert
      message="Unsupported browser"
      description="To measure accurately the memory used by the benchmarks you need to use a browser that support the Performance.memory API."
      action={
        <Button
          type="link"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Performance/memory#Browser_compatibility"
          target="_blank"
        >
          List of supported browser
        </Button>
      }
      showIcon
      closable
      type="warning"
    />
  );
};

/**
 * JS Benchmark class, it will mainly return a table with
 * the benchmarks result in it.
 * @return {*} a h1, a divided, an error message if needed, a table and two buttons
 */
class BenchES extends React.Component {
  /**
   * Constructor of the class, no argument are needed.
   */
  constructor() {
    super();
    this.onSelectChange = this.onSelectChange.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.doBenchmarks = this.doBenchmarks.bind(this);
    this.changeData = this.changeData.bind(this);
    this.state = {
      selectedRows: [],
      data: this.initData(),
      benchResults: [],
      benchInfo: null,
      isBenching: false,
      nextBenchmarks: [],
      currentBench: [],
      benchQueue: [],
    };
  }
  /**
   * Initialize the data to print the first table
   */
  initData = () => {
    const result = [];

    for (const [key, value] of Object.entries(availableBench)) {
      result.push({
        key: key,
        description: value,
        time: null,
        size: null,
        graph: <Tag>No graph yet for this benchmark</Tag>,
      });
    }
    return result;
  };
  /**
   * Update state with checked chechboxes
   * @param {*} selectedRowKeys
   */
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRows: selectedRowKeys });
  }
  /**
   * Add checked function to benchmark's queue
   */
  addToQueue() {
    const bench = this.state.benchQueue;
    const bench2 = [...bench, ...this.state.selectedRows];

    bench2.map((el, index) =>
      index === 0
        ? this.changeData(el, clockSpinner, clockSpinner)
        : this.changeData(el, pending, pending)
    );
    this.setState(
      {
        benchQueue: bench2,
        selectedRows: [],
      },
      () => {
        this.myInterval = setInterval(() => this.doBenchmarks(), 1000);
      }
    );
  }
  /**
   * Everytime the component update it will check if
   * there is benchmark to do left, if there isn't
   * It will clear the interval
   */
  componentDidUpdate() {
    if (this.state.benchQueue.length == 0) {
      clearInterval(this.myInterval);
    }
  }
  /**
   * If there is no other benchmark ongoing
   * And a benchmark in queue
   * It will do the benchmark
   * Take the result
   * Update the table with the result
   */
  doBenchmarks() {
    if (!this.state.isBenching) {
      const bench = Benchmark.benchInfo();
      const benchResults = this.state.benchResults;
      this.setState({ isBenching: true });
      if (this.state.benchQueue.length > 0) {
        const tmp = this.state.benchQueue;
        const functionToBench = tmp.shift();
        // const functionFromString = window[Benchmark];
        const benchResult = Benchmark.bench(functionToBench);
        if (!("error" in benchResult)) {
          benchResults[functionToBench] = benchResult;
          this.changeData(
            functionToBench,
            format.formatTime(
              benchResult.time,
              bench.unit.time,
              format.adaptedTimeSymbol(benchResult.time)
            ),
            format.formatSize(
              benchResult.size,
              bench.unit.size,
              format.adaptedSizeSymbol(benchResult.size)
            ),
            this.popUp(benchResult.data)
          );
          if (tmp !== null) this.changeData(tmp[0], clockSpinner, clockSpinner);
          // if (typeof functionFromString === "function") functionFromString();
          this.setState({ benchQueue: tmp });
        } else {
          if (tmp !== null) this.changeData(tmp[0], clockSpinner, clockSpinner);
          console.error(benchResult.error);
          this.setState({ benchQueue: tmp });
        }
      }
      this.setState({
        isBenching: false,
        benchInfo: bench,
        benchResults: benchResults,
      });
    }
  }
  /**
   * Create a popup with a graph
   * @param {*} data
   * @return {Object} a JSX object, a pop over
   */
  popUp(data) {
    return (
      <Popover content={this.graph(data)} trigger="click">
        <Tag>Show graph</Tag>
      </Popover>
    );
  }
  /**
   * Draw a graph of registred memory at different time
   * @param {Array} data Array of memory point
   * @return {Object} LineChart
   */
  graph(data) {
    return (
      <LineChart
        width={250}
        height={250}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line
          type="monotone"
          dataKey="usedJSHeapSize"
          stroke="#C70039"
          dot={false}
        />
      </LineChart>
    );
  }
  /**
   * Update table data
   * @param {*} key of the bench function to update in the table
   * @param {*} newTime value to print
   * @param {*} newSize value to print
   */
  changeData(key, newTime, newSize, newGraph = 0) {
    const currentData = this.state.data;
    currentData.map((data) => {
      if (data.key === key) {
        data.time = newTime;
        data.size = newSize;
        if (newGraph !== 0) data.graph = newGraph;
      }
    });
    this.setState({ data: currentData });
  }

  /**
   * Save done benchmarks as JSON on user's browser
   */
  saveAsJSON() {
    const bench = this.state.benchInfo;
    for (const benchResult in this.state.benchResults) {
      if (
        (this.state.benchResults[benchResult].hasOwnProperty("time") &&
          this.state.benchResults[benchResult].time != null &&
          this.state.benchResults[benchResult].time != NaN) ||
        (this.state.benchResults[benchResult].hasOwnProperty("size") &&
          this.state.benchResults[benchResult].size != null &&
          this.state.benchResults[benchResult].size != NaN)
      ) {
        console.log("bench result :");
        console.log({ benchResult });
        const description = this.state.benchResults[benchResult].description;
        console.log("time : ");
        console.log(this.state.benchResults[benchResult].time);
        console.log("size : ");
        console.log(this.state.benchResults[benchResult].size);
        console.log("bench : ");
        console.log(this.state.benchResults[benchResult]);
        const time = this.state.benchResults[benchResult].time;
        const size = this.state.benchResults[benchResult].size;
        const id = this.state.benchResults[benchResult].id;
        bench["bench"].push({
          description: description,
          time: time,
          size: Math.trunc(size),
          id: id,
        });
      }
    }
    console.log(bench);
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(bench));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "exportName" + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  /**
   * @return {*} a h1, a divided, an error message if needed, a table and two buttons
   */
  render() {
    const { selectedRows } = this.state;
    const rowSelection = {
      selectedRows,
      onChange: this.onSelectChange,
    };
    return (
      <>
        <h1>JS Benchmark</h1>
        <Divider />
        {"memory" in performance ? (
          <></>
        ) : (
          <>
            <WarningDiv />
            <Divider />
          </>
        )}
        <Styles>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            data={this.state.data}
            checkboxes={true}
          />

          <LaunchButton
            onClick={this.addToQueue}
            disabled={
              this.state.selectedRows.length === 0 || this.state.isBenching
            }
          >
            {this.state.selectedRows.length === 0 || this.state.isBenching ? (
              <StopTwoTone twoToneColor="#7f7f82" />
            ) : (
              <RightCircleTwoTone twoToneColor="#007d82" />
            )}{" "}
            Add selection to Benchmark&apos;s Queue
          </LaunchButton>
          <button onClick={() => this.saveAsJSON()}>Save</button>
        </Styles>
      </>
    );
  }
}
export default BenchES;
