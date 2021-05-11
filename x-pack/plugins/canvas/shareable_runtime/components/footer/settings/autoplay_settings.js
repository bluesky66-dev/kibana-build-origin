"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AutoplaySettings = exports.AutoplaySettingsComponent = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _context = require("../../../context");

var _time_interval = require("../../../../public/lib/time_interval");

var _custom_interval = require("../../../../public/components/workpad_header/view_menu/custom_interval");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : {
    default: obj
  };
}
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The panel used to configure Autolay in Shareable Canvas Workpads.
 */


const AutoplaySettingsComponent = ({
  isEnabled,
  interval,
  onSetAutoplay,
  onSetInterval
}) => /*#__PURE__*/_react.default.createElement("div", {
  style: {
    padding: 16
  }
}, /*#__PURE__*/_react.default.createElement(_eui.EuiSwitch, {
  name: "cycle",
  id: "cycle",
  label: "Cycle Slides",
  checked: isEnabled,
  onChange: () => onSetAutoplay(!isEnabled)
}), /*#__PURE__*/_react.default.createElement(_eui.EuiHorizontalRule, {
  margin: "m"
}), /*#__PURE__*/_react.default.createElement(_custom_interval.CustomInterval, {
  defaultValue: interval,
  onSubmit: value => onSetInterval((0, _time_interval.createTimeInterval)(value))
}));
/**
 * A store-connected container for the `AutoplaySettings` component.
 */


exports.AutoplaySettingsComponent = AutoplaySettingsComponent;

const AutoplaySettings = () => {
  const [{
    settings
  }, dispatch] = (0, _context.useCanvasShareableState)();
  const {
    autoplay
  } = settings;
  const {
    isEnabled,
    interval
  } = autoplay;

  const onSetInterval = newInterval => dispatch((0, _context.setAutoplayIntervalAction)(newInterval));

  const onSetAutoplay = enabled => dispatch((0, _context.setAutoplayAction)(enabled));

  return /*#__PURE__*/_react.default.createElement(AutoplaySettingsComponent, {
    isEnabled,
    interval,
    onSetAutoplay,
    onSetInterval
  });
};

exports.AutoplaySettings = AutoplaySettings;