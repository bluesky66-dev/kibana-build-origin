"use strict";

var _react = _interopRequireDefault(require("react"));

var _react2 = require("@storybook/react");

var _ = require("../");

var _render = require("../../__stories__/render");

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


const plotOptions = {
  canvas: false,
  colors: ['#882E72', '#B178A6', '#D6C1DE'],
  grid: {
    margin: {
      bottom: 0,
      left: 0,
      right: 30,
      top: 20
    }
  },
  legend: {
    show: true
  },
  series: {
    bubbles: {
      show: true,
      fill: false
    }
  },
  xaxis: {
    show: true,
    mode: 'time'
  },
  yaxis: {
    show: true
  }
};
const data = [{
  bubbles: {
    show: true
  },
  data: [[1546351551031, 33, {
    size: 5
  }], [1546351551131, 38, {
    size: 2
  }]],
  label: 'done'
}, {
  bubbles: {
    show: true
  },
  data: [[1546351551032, 37, {
    size: 4
  }], [1546351551139, 45, {
    size: 3
  }]],
  label: 'running'
}];
(0, _react2.storiesOf)('renderers/plot', module).add('default', () => {
  const config = {
    data,
    options: plotOptions,
    font: {
      css: '',
      spec: {},
      type: 'style'
    }
  };
  return /*#__PURE__*/_react.default.createElement(_render.Render, {
    renderer: _.plot,
    config: config
  });
});