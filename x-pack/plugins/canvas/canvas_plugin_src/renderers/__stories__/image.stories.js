"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _image = require("../image");

var _render = require("./render");

var _elastic_logo = require("../../lib/elastic_logo");

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


(0, _react2.storiesOf)('renderers/image', module).add('default', () => {
  const config = {
    type: 'image',
    mode: 'cover',
    dataurl: _elastic_logo.elasticLogo
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _image.image,
    config: config,
    width: "400px"
  });
});