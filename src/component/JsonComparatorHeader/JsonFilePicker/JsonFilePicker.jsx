import React from "react";
import { Dropdown } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { LocalDirPicker, LocalFilesPicker } from "./FilePicker/LocalFilePicker";
import PropTypes from "prop-types";
import "./JsonFilePicker.css";
/**
 *
 * @param {*} props
 * @return {*}
 */
export default function JsonFilePicker(props) {
  return (
    <div id="first">
      <Dropdown
        overlay={props.menu}
        onVisibleChange={props.fetchJsonList}
        disabled={props.disabled}
      >
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          Select JSON from server <DownOutlined />
        </a>
      </Dropdown>

      <LocalDirPicker
        text="Select directory"
        onChange={props.handleUploadedFiles}
      />
      <LocalFilesPicker
        text="Select files"
        onChange={props.handleUploadedFiles}
      />
    </div>
  );
}
JsonFilePicker.propTypes = {
  menu: PropTypes.object.isRequired,
  fetchJsonList: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  handleUploadedFiles: PropTypes.func.isRequired,
};
