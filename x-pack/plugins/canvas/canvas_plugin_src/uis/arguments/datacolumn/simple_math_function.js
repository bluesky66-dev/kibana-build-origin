"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleMathFunction = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _eui = require("@elastic/eui");

var _i18n = require("../../../../i18n");

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
  DataColumn: strings
} = _i18n.ArgumentStrings;

const SimpleMathFunction = ({
  onChange,
  value,
  inputRef,
  onlymath
}) => {
  const options = [{
    text: strings.getOptionAverage(),
    value: 'mean'
  }, {
    text: strings.getOptionCount(),
    value: 'size'
  }, {
    text: strings.getOptionFirst(),
    value: 'first'
  }, {
    text: strings.getOptionLast(),
    value: 'last'
  }, {
    text: strings.getOptionMax(),
    value: 'max'
  }, {
    text: strings.getOptionMedian(),
    value: 'median'
  }, {
    text: strings.getOptionMin(),
    value: 'min'
  }, {
    text: strings.getOptionSum(),
    value: 'sum'
  }, {
    text: strings.getOptionUnique(),
    value: 'unique'
  }];

  if (!onlymath) {
    options.unshift({
      text: strings.getOptionValue(),
      value: ''
    });
  }

  return /*#__PURE__*/_react.default.createElement(_eui.EuiSelect, {
    compressed: true,
    options: options,
    inputRef: inputRef,
    value: value,
    onChange: onChange
  });
};

exports.SimpleMathFunction = SimpleMathFunction;
SimpleMathFunction.propTypes = {
  onChange: _propTypes.default.func,
  value: _propTypes.default.string,
  inputRef: _propTypes.default.func,
  onlymath: _propTypes.default.bool
};
SimpleMathFunction.defaultProps = {
  value: ''
};