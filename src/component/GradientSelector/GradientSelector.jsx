import React from "react";
import PropTypes from "prop-types";
import { Switch, Slider, Row, Col } from "antd";
import "./GradientSelector.css";
/**
 * Gradient switch (on/off) and slider for
 * @param {*} props
 * @return {*} JSX object
 */
export default function GradientSelector(props) {
  return (
    <div className="options">
      <Row>
        <Col>Comparison type :</Col>
        <Col>
          <Switch
            checked={props.checked}
            onChange={props.onChangeSwitch}
            checkedChildren="Wider Top and Bottom"
            unCheckedChildren="Strict Top and Bottom"
          />
        </Col>
        <Col hidden={!props.checked}>Comparison margin :</Col>
        <Col span="4" hidden={!props.checked}>
          <Slider
            min={51}
            max={100}
            defaultValue={props.value}
            disabled={!props.checked}
            onChange={props.onChangeSlider}
          />
        </Col>
        <Col hidden={!props.checked}>{props.value} %</Col>
      </Row>
    </div>
  );
}
GradientSelector.propTypes = {
  checked: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired,
  onChangeSwitch: PropTypes.func.isRequired,
  onChangeSlider: PropTypes.func.isRequired,
};
