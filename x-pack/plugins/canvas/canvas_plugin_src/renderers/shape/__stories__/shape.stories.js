"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ = require("../");

var _render = require("../../__stories__/render");

var _shape = require("../../../functions/common/shape");

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


(0, _react2.storiesOf)('renderers/shape', module).add('default', () => {
  const config = {
    type: 'shape',
    border: '#FFEEDD',
    borderWidth: 8,
    shape: _shape.Shape.BOOKMARK,
    fill: '#112233',
    maintainAspect: true
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.shape,
    config: config
  });
});