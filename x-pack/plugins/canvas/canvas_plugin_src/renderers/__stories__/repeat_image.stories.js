"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _repeat_image = require("../repeat_image");

var _render = require("./render");

var _elastic_logo = require("../../lib/elastic_logo");

var _elastic_outline = require("../../lib/elastic_outline");

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


(0, _react2.storiesOf)('renderers/repeatImage', module).add('default', () => {
  const config = {
    count: 42,
    image: _elastic_logo.elasticLogo,
    size: 20,
    max: 60,
    emptyImage: _elastic_outline.elasticOutline
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _repeat_image.repeatImage,
    config: config,
    width: "400px"
  });
});