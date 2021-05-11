"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _i18n = require("../../../i18n");

var _public = require("../../../../../../src/plugins/kibana_react/public");

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
  markdown: strings
} = _i18n.RendererStrings;

const markdown = () => ({
  name: 'markdown',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const fontStyle = config.font ? config.font.spec : {};

    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_public.Markdown, {
      className: "canvasMarkdown",
      style: fontStyle,
      markdown: config.content,
      openLinksInNewTab: config.openLinksInNewTab
    }), domNode, () => handlers.done());

    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }

});

exports.markdown = markdown;