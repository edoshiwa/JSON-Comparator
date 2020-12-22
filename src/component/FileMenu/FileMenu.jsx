import React from "react";
import PropTypes from "prop-types";
import { Menu } from "antd";
/**
 *
 * @param {*} props
 * @return {*}
 */
export default function FileMenu(props) {
  return (
    <Menu onClick={props.onClick}>
      {props.arr.map((element, index) => (
        <Menu.Item
          key={index}
          title={element}
          disabled={props.jsonArrayHeader.includes(element) ? true : false}
        >
          {element}
        </Menu.Item>
      ))}
    </Menu>
  );
}
FileMenu.propTypes = {
  onClick: PropTypes.func.isRequired,
  arr: PropTypes.array.isRequired,
  jsonArrayHeader: PropTypes.array.isRequired,
};
