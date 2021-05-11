"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DateFormatArgInput = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _format_select = require("../../../../public/components/format_select/format_select");

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


const DateFormatArgInput = ({
  dateFormats,
  onValueChange,
  argValue,
  argId
}) => /*#__PURE__*/_react.default.createElement(_format_select.FormatSelect, {
  argId: argId,
  argValue: argValue,
  formatOptions: dateFormats,
  onValueChange: onValueChange,
  defaultCustomFormat: "M/D/YY h:ma"
});

exports.DateFormatArgInput = DateFormatArgInput;
DateFormatArgInput.propTypes = {
  dateFormats: _propTypes.default.arrayOf(_propTypes.default.shape({
    value: _propTypes.default.string,
    text: _propTypes.default.string
  })).isRequired,
  onValueChange: _propTypes.default.func.isRequired,
  argValue: _propTypes.default.oneOfType([_propTypes.default.string, _propTypes.default.number, _propTypes.default.bool]).isRequired,
  argId: _propTypes.default.string.isRequired
};