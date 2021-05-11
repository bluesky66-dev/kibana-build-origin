"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DropdownFilter = void 0;

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
  DropdownFilter: strings
} = _i18n.ComponentStrings;

const DropdownFilter = ({
  value,
  onChange,
  commit,
  choices = []
}) => {
  let options = [{
    value: '%%CANVAS_MATCH_ALL%%',
    text: `-- ${strings.getMatchAllOptionLabel()} --`
  }];
  options = options.concat(choices.map(choice => ({
    value: choice[0],
    text: choice[1]
  })));

  const changeHandler = e => {
    if (e && e.target) {
      const target = e.target;
      onChange(target.value);
      commit(target.value);
    }
  };

  const dropdownOptions = options.map(option => {
    const {
      text
    } = option;
    const optionValue = option.value;
    const selected = optionValue === value;
    return /*#__PURE__*/_react.default.createElement("option", {
      key: optionValue,
      value: optionValue,
      "aria-selected": selected
    }, text);
  });
  return /*#__PURE__*/_react.default.createElement("div", {
    className: "canvasDropdownFilter"
  }, /*#__PURE__*/_react.default.createElement("select", {
    className: "canvasDropdownFilter__select",
    value: value,
    onChange: changeHandler,
    "data-test-subj": "canvasDropdownFilter__select"
  }, dropdownOptions), /*#__PURE__*/_react.default.createElement(_eui.EuiIcon, {
    className: "canvasDropdownFilter__icon",
    type: "arrowDown"
  }));
};

exports.DropdownFilter = DropdownFilter;
DropdownFilter.propTypes = {
  choices: _propTypes.default.array,
  value: _propTypes.default.string,
  onChange: _propTypes.default.func.isRequired,
  commit: _propTypes.default.func.isRequired
};