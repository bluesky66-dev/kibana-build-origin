"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metricInitializer = void 0;

var _fonts = require("../../../common/lib/fonts");

var _i18n = require("../../../i18n");

var _public = require("../../../../../../src/plugins/data/public");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Metric: strings
} = _i18n.ViewStrings;

const metricInitializer = (core, plugin) => {
  return () => ({
    name: 'metric',
    displayName: strings.getDisplayName(),
    modelArgs: [['_', {
      label: strings.getNumberDisplayName()
    }]],
    requiresContext: false,
    args: [{
      name: 'metricFormat',
      displayName: strings.getMetricFormatDisplayName(),
      help: strings.getMetricFormatHelp(),
      argType: 'numberFormat',
      default: `"${core.uiSettings.get(_public.UI_SETTINGS.FORMAT_NUMBER_DEFAULT_PATTERN)}"`
    }, {
      name: '_',
      displayName: strings.getLabelDisplayName(),
      help: strings.getLabelHelp(),
      argType: 'string',
      default: '""'
    }, {
      name: 'metricFont',
      displayName: strings.getMetricFontDisplayName(),
      help: strings.getMetricFontHelp(),
      argType: 'font',
      default: `{font size=48 family="${_fonts.openSans.value}" color="#000000" align=center lHeight=48}`
    }, {
      name: 'labelFont',
      displayName: strings.getLabelFontDisplayName(),
      help: strings.getLabelFontHelp(),
      argType: 'font',
      default: `{font size=18 family="${_fonts.openSans.value}" color="#000000" align=center}`
    }]
  });
};

exports.metricInitializer = metricInitializer;