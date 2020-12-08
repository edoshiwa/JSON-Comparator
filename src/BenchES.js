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
const LaunchButton = styled.button`
  background: ${(props) =>
    props.disabled
      ? "radial-gradient(circle, rgba(0,125,130,0.50) 0%, rgba(0,157,99,0.50) 100%);"
      : "radial-gradient(circle, rgba(0,125,130,1) 0%, rgba(0,157,99,1) 100%);"};
  color: ${(props) => (props.disabled ? "#7f7f82" : "#ffffff")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "auto")};
`;
const pending = <Tag color="gold">Pending</Tag>;
const clockSpinner = <ClockLoader color="#007d82" size="25px" />;
const availableBench = Benchmark.Description;
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
 * @return {*}
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
 * @return {*} a table
 */
class BenchES extends React.Component {
  /**
   *
   * @param {*} props
   */
  constructor(props) {
    super();
    this.onSelectChange = this.onSelectChange.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.doBenchmarks = this.doBenchmarks.bind(this);
    this.changeData = this.changeData.bind(this);
    this.state = {
      selectedRows: [],
      data: this.initData(),
      isBenching: false,
      nextBenchmarks: [],
      currentBench: [],
      benchQueue: [],
    };
  }
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
   *
   * @param {*} selectedRowKeys
   */
  onSelectChange(selectedRowKeys) {
    this.setState({ selectedRows: selectedRowKeys });
  }
  /**
   *
   * @param {*} selectedRows
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
   *
   */
  componentDidUpdate() {
    if (this.state.benchQueue.length == 0) {
      clearInterval(this.myInterval);
      // this.doBenchmarks();
    }
  }
  /**
   *
   */
  doBenchmarks() {
    if (!this.state.isBenching) {
      const tmp2 = this.state.benchQueue;
      console.log(tmp2);
      const bench = Benchmark.benchInfo();
      this.setState({ isBenching: true });
      if (this.state.benchQueue.length > 0) {
        const tmp = this.state.benchQueue;
        const functionToBench = tmp.shift();
        const functionFromString = window[Benchmark];
        const benchResult = Benchmark.bench(functionToBench);
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
        bench.bench.push(benchResult);
        if (typeof functionFromString === "function") functionFromString();
        console.log(tmp);
        this.setState({ benchQueue: tmp });
      }
      console.log({ bench: bench });
      this.setState({ isBenching: false });
    }
  }
  /**
   *
   * @param {*} data
   */
  popUp(data) {
    return (
      <Popover content={this.graph(data)} trigger="click">
        <Tag>Show graph</Tag>
      </Popover>
    );
  }
  /**
   *
   * @param {*} data
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
   *
   * @param {*} key
   * @param {*} newTime
   * @param {*} newSize
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
   * @return {*} a table
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
          <Divider />
          <div></div>
        </Styles>
      </>
    );
  }
}
export default BenchES;
