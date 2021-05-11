"use strict";

var _react = require("@storybook/react");

var _react2 = _interopRequireDefault(require("react"));

var _addonActions = require("@storybook/addon-actions");

var _palette = require("../palette");

var _palettes = require("../../../../common/lib/palettes");

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


(0, _react.storiesOf)('arguments/Palette', module).add('default', () => /*#__PURE__*/_react2.default.createElement("div", {
  className: "canvasContainerWrapper",
  style: {
    width: '200px'
  }
}, /*#__PURE__*/_react2.default.createElement(_palette.PaletteArgInput, {
  argValue: {
    type: 'expression',
    chain: [{
      arguments: {
        _: _palettes.paulTor14.colors,
        gradient: [_palettes.paulTor14.gradient]
      },
      function: 'palette',
      type: 'function'
    }]
  },
  onValueChange: (0, _addonActions.action)('onValueChange'),
  renderError: (0, _addonActions.action)('renderError')
})));