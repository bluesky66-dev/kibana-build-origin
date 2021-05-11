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


(0, _react2.storiesOf)('renderers/markdown', module).add('default', () => {
  const config = {
    content: '# This is Markdown',
    font: {
      css: '',
      spec: {},
      type: 'style'
    },
    openLinksInNewTab: false
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.markdown,
    config: config
  });
}).add('links in new tab', () => {
  const config = {
    content: '[Elastic.co](https://elastic.co)',
    font: {
      css: '',
      spec: {},
      type: 'style'
    },
    openLinksInNewTab: true
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.markdown,
    config: config
  });
});