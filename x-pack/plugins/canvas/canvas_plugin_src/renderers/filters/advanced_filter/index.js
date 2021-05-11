"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.advancedFilter = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _component = require("./component");

var _i18n = require("../../../../i18n");

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
  advancedFilter: strings
} = _i18n.RendererStrings;

const advancedFilter = () => ({
  name: 'advanced_filter',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,
  height: 50,

  render(domNode, _, handlers) {
    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_component.AdvancedFilter, {
      commit: handlers.setFilter,
      value: handlers.getFilter()
    }), domNode, () => handlers.done());

    handlers.onDestroy(() => {
      _reactDom.default.unmountComponentAtNode(domNode);
    });
  }

});

exports.advancedFilter = advancedFilter;