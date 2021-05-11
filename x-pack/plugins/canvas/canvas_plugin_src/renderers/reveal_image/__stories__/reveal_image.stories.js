"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ = require("../");

var _render = require("../../__stories__/render");

var _elastic_outline = require("../../../lib/elastic_outline");

var _elastic_logo = require("../../../lib/elastic_logo");

var _revealImage = require("../../../functions/common/revealImage");

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


(0, _react2.storiesOf)('renderers/revealImage', module).add('default', () => {
  const config = {
    image: _elastic_logo.elasticLogo,
    emptyImage: _elastic_outline.elasticOutline,
    origin: _revealImage.Origin.LEFT,
    percent: 0.45
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.revealImage,
    config: config
  });
});