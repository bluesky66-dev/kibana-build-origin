"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StateChange = void 0;

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _jsondiffpatch = require("jsondiffpatch");

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


const StateChange = ({
  action
}) => {
  if (!action) {
    return null;
  }

  const {
    change,
    previousState
  } = action;

  const html = _jsondiffpatch.formatters.html.format(change, previousState);

  _jsondiffpatch.formatters.html.hideUnchanged();

  return /*#__PURE__*/_react.default.createElement(_eui.EuiAccordion, {
    className: "panel__stateChange",
    id: "state_change",
    initialIsOpen: true,
    buttonContent: "State Change"
  }, /*#__PURE__*/_react.default.createElement("div", {
    dangerouslySetInnerHTML: {
      __html: html
    }
  }));
};

exports.StateChange = StateChange;