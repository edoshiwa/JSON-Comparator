/* eslint-disable no-invalid-this */
/* eslint-disable valid-jsdoc */
import * as Benchmark from "./Bench.js";
import React from "react";
import { Divider } from "antd";
import { Table } from "./component/Table";
import styled from "styled-components";
import * as format from "./util";
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
const availableBench = Benchmark.Description;
const columns = [
  { title: "Description", dataIndex: "description" },
  { title: "Time", dataIndex: "time" },
  { title: "Size", dataIndex: "size" },
];

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
          )
        );
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
   * @param {*} key
   * @param {*} newTime
   * @param {*} newSize
   */
  changeData(key, newTime, newSize) {
    const currentData = this.state.data;
    currentData.map((data) => {
      if (data.key === key) {
        data.time = newTime;
        data.size = newSize;
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
        <Styles>
          <Table
            rowSelection={rowSelection}
            columns={columns}
            data={this.state.data}
            checkboxes={true}
          />
          <button
            onClick={this.addToQueue}
            disabled={
              this.state.selectedRows.length === 0 || this.state.isBenching
            }
          >
            Add selection to Benchmark&apos;s Queue
          </button>
          <Divider />
          <div></div>
        </Styles>
      </>
    );
  }
}
export default BenchES;
