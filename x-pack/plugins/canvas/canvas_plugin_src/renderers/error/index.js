"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _eui = require("@elastic/eui");

var _error = require("../../../public/components/error");

var _popover = require("../../../public/components/popover");

var _i18n = require("../../../i18n");

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
  error: strings
} = _i18n.RendererStrings;

const error = () => ({
  name: 'error',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const draw = () => {
      const buttonSize = Math.min(domNode.clientHeight, domNode.clientWidth);

      const button = handleClick => /*#__PURE__*/_react.default.createElement(_eui.EuiIcon, {
        className: "canvasRenderError__icon",
        onClick: handleClick,
        style: {
          height: buttonSize,
          width: buttonSize
        },
        type: "alert"
      });

      _reactDom.default.render( /*#__PURE__*/_react.default.createElement("div", {
        className: "canvasRenderError"
      }, /*#__PURE__*/_react.default.createElement(_popover.Popover, {
        button: button
      }, () => /*#__PURE__*/_react.default.createElement(_error.Error, {
        payload: config
      }))), domNode, () => handlers.done());
    };

    draw();
    handlers.onResize(draw);
    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }

});

exports.error = error;