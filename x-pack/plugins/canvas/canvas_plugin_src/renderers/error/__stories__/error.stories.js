"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ = require("../");

var _render = require("../../__stories__/render");

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


(0, _react2.storiesOf)('renderers/error', module).add('default', () => {
  const thrownError = new Error('There was an error');
  const config = {
    error: thrownError
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.error,
    config: config
  });
});