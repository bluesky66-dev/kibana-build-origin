"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.plot = void 0;

var _lodash = require("lodash");

var _resolved_arg = require("../../../public/lib/resolved_arg");

var _legend_options = require("../../../public/lib/legend_options");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Plot: strings
} = _i18n.ViewStrings;
const styleProps = ['lines', 'bars', 'points', 'fill', 'stack'];

const plot = () => ({
  name: 'plot',
  displayName: strings.getDisplayName(),
  modelArgs: ['x', 'y', 'color', 'size', 'text'],
  args: [{
    name: 'palette',
    argType: 'palette'
  }, {
    name: 'legend',
    displayName: strings.getLegendDisplayName(),
    help: strings.getLegendHelp(),
    argType: 'select',
    default: 'ne',
    options: {
      choices: _legend_options.legendOptions
    }
  }, {
    name: 'xaxis',
    displayName: strings.getXaxisDisplayName(),
    help: strings.getXaxisHelp(),
    argType: 'axisConfig',
    default: true
  }, {
    name: 'yaxis',
    displayName: strings.getYaxisDisplayName(),
    help: strings.getYaxisHelp(),
    argType: 'axisConfig',
    default: true
  }, {
    name: 'font',
    argType: 'font'
  }, {
    name: 'defaultStyle',
    displayName: strings.getDefaultStyleDisplayName(),
    help: strings.getDefaultStyleHelp(),
    argType: 'seriesStyle',
    default: '{seriesStyle points=5}',
    options: {
      include: styleProps
    }
  }, {
    name: 'seriesStyle',
    argType: 'seriesStyle',
    options: {
      include: styleProps
    },
    multi: true
  }],

  resolve({
    context
  }) {
    if ((0, _resolved_arg.getState)(context) !== 'ready') {
      return {
        labels: []
      };
    }

    return {
      labels: (0, _lodash.uniqBy)((0, _lodash.map)((0, _resolved_arg.getValue)(context).rows, 'color').filter(v => v !== undefined))
    };
  }

});

exports.plot = plot;