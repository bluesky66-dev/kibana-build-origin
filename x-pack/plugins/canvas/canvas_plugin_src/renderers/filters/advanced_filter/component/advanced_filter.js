"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AdvancedFilter = void 0;

var _eui = require("@elastic/eui");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _i18n = require("../../../../../i18n");

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


const {
  AdvancedFilter: strings
} = _i18n.ComponentStrings;

const AdvancedFilter = ({
  value = '',
  onChange,
  commit
}) => /*#__PURE__*/_react.default.createElement("form", {
  onSubmit: e => {
    e.preventDefault();
    commit(value);
  },
  className: "canvasAdvancedFilter"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexGroup, {
  gutterSize: "xs"
}, /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, null, /*#__PURE__*/_react.default.createElement("input", {
  type: "text",
  className: "canvasAdvancedFilter__input",
  placeholder: strings.getInputPlaceholder(),
  value: value,
  onChange: e => onChange(e.target.value)
})), /*#__PURE__*/_react.default.createElement(_eui.EuiFlexItem, {
  grow: false
}, /*#__PURE__*/_react.default.createElement("button", {
  className: "canvasAdvancedFilter__button",
  type: "submit"
}, strings.getApplyButtonLabel()))));

exports.AdvancedFilter = AdvancedFilter;
AdvancedFilter.defaultProps = {
  value: ''
};
AdvancedFilter.propTypes = {
  onChange: _propTypes.default.func.isRequired,
  value: _propTypes.default.string,
  commit: _propTypes.default.func.isRequired
};