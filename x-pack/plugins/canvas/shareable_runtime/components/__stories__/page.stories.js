"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _context_example = require("../../test/context_example");

var _page = require("../page");

var _test = require("../../test");

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
  austin
} = _test.sharedWorkpads;
(0, _react.storiesOf)('shareables/Page', module).add('contextual: austin', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  source: "austin",
  style: {
    height: 720
  }
}, /*#__PURE__*/_react2.default.createElement(_page.Page, {
  index: 3
}))).add('contextual: hello', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  source: "hello",
  style: {
    height: 720
  }
}, /*#__PURE__*/_react2.default.createElement(_page.Page, {
  index: 0
}))).add('component', () => /*#__PURE__*/_react2.default.createElement(_context_example.ExampleContext, {
  source: "austin",
  style: {
    height: 720
  }
}, /*#__PURE__*/_react2.default.createElement(_page.PageComponent, {
  height: 720,
  width: 1280,
  page: austin.pages[3]
})));