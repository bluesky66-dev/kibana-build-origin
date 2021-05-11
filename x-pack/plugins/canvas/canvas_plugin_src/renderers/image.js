"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.image = void 0;

var _reactDom = _interopRequireDefault(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

var _elastic_logo = require("../lib/elastic_logo");

var _url = require("../../common/lib/url");

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
  image: strings
} = _i18n.RendererStrings;

const image = () => ({
  name: 'image',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    const dataurl = (0, _url.isValidUrl)(config.dataurl) ? config.dataurl : _elastic_logo.elasticLogo;
    const style = {
      height: '100%',
      backgroundImage: `url(${dataurl})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      backgroundSize: config.mode
    };

    _reactDom.default.render( /*#__PURE__*/_react.default.createElement("div", {
      style: style
    }), domNode, () => handlers.done());

    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }

});

exports.image = image;