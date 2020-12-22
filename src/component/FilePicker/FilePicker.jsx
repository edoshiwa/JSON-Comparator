import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "./FilePicker.css";

/**
 * JSX component, directory picker
 * @param {*} props
 * @param {*} props.text label for dir picker
 * @param {*} props.onChange when a new dir is selected
 * @return {*} JSX Directory Picker 
 */
export function DirPicker (props) {
    return <> <label htmlFor="dirpicker" className="input-btn">
{props.text} <UploadOutlined />
</label>
<input
type="file"
id="dirpicker"
name="fileList"
directory=""
webkitdirectory=""
onChange={props.onChange}
/></>;
}
DirPicker.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func
}

/**
 * JSX component, files picker
 * @param {*} props
 * @param {*} props.text label for file picker
 * @param {*} props.onChange when new files are selected
 * @return {*} JSX Files Picker 
 */
export function FilesPicker (props) {
    return (
<> <label htmlFor="filepicker" className="input-btn"> {props.text}
 <UploadOutlined />
</label>
<input
type="file"
id="filepicker"
name="fileList"
multiple="multiple"
accept=".json"
onChange={props.onChange}
/>
</>)};
FilesPicker.propTypes = {
    text: PropTypes.string,
    onChange: PropTypes.func
}