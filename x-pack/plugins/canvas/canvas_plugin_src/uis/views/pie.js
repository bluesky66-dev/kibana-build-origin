"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pie = void 0;

var _lodash = require("lodash");

var _legend_options = require("../../../public/lib/legend_options");

var _resolved_arg = require("../../../public/lib/resolved_arg");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Pie: strings
} = _i18n.ViewStrings;

const pie = () => ({
  name: 'pie',
  displayName: strings.getDisplayName(),
  modelArgs: [['color', {
    label: 'Slice Labels'
  }], ['size', {
    label: 'Slice Angles'
  }]],
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
    name: 'hole',
    displayName: strings.getHoleDisplayName(),
    help: strings.getHoleHelp(),
    argType: 'range',
    default: 50,
    options: {
      min: 0,
      max: 100
    }
  }, {
    name: 'labelRadius',
    displayName: strings.getLabelRadiusDisplayName(),
    help: strings.getLabelRadiusHelp(),
    argType: 'range',
    default: 100,
    options: {
      min: 0,
      max: 100
    }
  }, {
    name: 'radius',
    displayName: strings.getRadiusDisplayName(),
    help: strings.getRadiusHelp(),
    argType: 'percentage',
    default: 1
  }, {
    name: 'tilt',
    displayName: strings.getTiltDisplayName(),
    help: strings.getTiltHelp(),
    argType: 'percentage',
    default: 1
  }, {
    name: 'labels',
    displayName: strings.getLabelsDisplayName(),
    help: strings.getLabelsHelp(),
    argType: 'toggle',
    default: true,
    options: {
      labelValue: strings.getLabelsToggleSwitch()
    }
  }, {
    name: 'seriesStyle',
    argType: 'seriesStyle',
    multi: true
  }, {
    name: 'font',
    argType: 'font'
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
      labels: (0, _lodash.uniq)((0, _lodash.map)((0, _resolved_arg.getValue)(context).rows, 'color').filter(v => v !== undefined))
    };
  }

});

exports.pie = pie;