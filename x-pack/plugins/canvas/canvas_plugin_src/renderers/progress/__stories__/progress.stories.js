"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ = require("../");

var _render = require("../../__stories__/render");

var _progress = require("../../../functions/common/progress");

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


(0, _react2.storiesOf)('renderers/progress', module).add('default', () => {
  const config = {
    barColor: '#bc1234',
    barWeight: 20,
    font: {
      css: '',
      spec: {},
      type: 'style'
    },
    label: '66%',
    max: 1,
    shape: _progress.Shape.UNICORN,
    value: 0.66,
    valueColor: '#000',
    valueWeight: 15
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.progress,
    config: config
  });
});