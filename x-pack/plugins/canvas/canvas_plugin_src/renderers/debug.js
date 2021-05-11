"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.debug = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _debug = require("../../public/components/debug");

var _i18n = require("../../i18n");

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
  debug: strings
} = _i18n.RendererStrings;

const debug = () => ({
  name: 'debug',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const renderDebug = () => /*#__PURE__*/_react.default.createElement("div", {
      style: {
        width: domNode.offsetWidth,
        height: domNode.offsetHeight
      }
    }, /*#__PURE__*/_react.default.createElement(_debug.Debug, {
      payload: config
    }));

    _reactDom.default.render(renderDebug(), domNode, () => handlers.done());

    if (handlers.onResize) {
      handlers.onResize(() => {
        _reactDom.default.render(renderDebug(), domNode, () => handlers.done());
      });
    }

    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }

});

exports.debug = debug;