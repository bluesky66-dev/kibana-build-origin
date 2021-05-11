"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _context_example = require("../../../test/context_example");

var _scrubber = require("../scrubber");

var _workpads = require("../../../../__fixtures__/workpads");

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


(0, _react2.storiesOf)('shareables/Footer/Scrubber', module).add('contextual: hello', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, {
  source: "hello",
  style: {
    height: 172
  },
  isScrubberVisible: true
}, /*#__PURE__*/_react.default.createElement(_scrubber.Scrubber, null))).add('contextual: austin', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, {
  source: "austin",
  style: {
    height: 172
  },
  isScrubberVisible: true
}, /*#__PURE__*/_react.default.createElement(_scrubber.Scrubber, null))).add('component', () => /*#__PURE__*/_react.default.createElement(_context_example.ExampleContext, {
  style: {
    height: 172
  }
}, /*#__PURE__*/_react.default.createElement(_scrubber.ScrubberComponent, {
  isScrubberVisible: true,
  pages: _workpads.workpads[0].pages
})));