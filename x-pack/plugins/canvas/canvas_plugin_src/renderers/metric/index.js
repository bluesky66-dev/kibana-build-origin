"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metric = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));

var _i18n = require("../../../i18n");

var _metric = require("./component/metric");

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
  metric: strings
} = _i18n.RendererStrings;

const metric = () => ({
  name: 'metric',
  displayName: strings.getDisplayName(),
  help: strings.getHelpDescription(),
  reuseDomNode: true,

  render(domNode, config, handlers) {
    _reactDom.default.render( /*#__PURE__*/_react.default.createElement(_metric.Metric, {
      label: config.label,
      labelFont: config.labelFont ? config.labelFont.spec : {},
      metric: config.metric,
      metricFont: config.metricFont ? config.metricFont.spec : {},
      metricFormat: config.metricFormat
    }), domNode, () => handlers.done());

    handlers.onDestroy(() => _reactDom.default.unmountComponentAtNode(domNode));
  }

});

exports.metric = metric;