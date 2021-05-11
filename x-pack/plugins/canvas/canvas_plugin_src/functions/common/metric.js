"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.metric = metric;

var _fonts = require("../../../common/lib/fonts");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function metric() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().metric;
  return {
    name: 'metric',
    aliases: [],
    type: 'render',
    inputTypes: ['number', 'string', 'null'],
    help,
    args: {
      label: {
        types: ['string'],
        aliases: ['_', 'text', 'description'],
        help: argHelp.label,
        default: '""'
      },
      labelFont: {
        types: ['style'],
        help: argHelp.labelFont,
        default: `{font size=14 family="${_fonts.openSans.value}" color="#000000" align=center}`
      },
      metricFont: {
        types: ['style'],
        help: argHelp.metricFont,
        default: `{font size=48 family="${_fonts.openSans.value}" color="#000000" align=center lHeight=48}`
      },
      metricFormat: {
        types: ['string'],
        aliases: ['format'],
        help: argHelp.metricFormat
      }
    },
    fn: (input, {
      label,
      labelFont,
      metricFont,
      metricFormat
    }) => {
      return {
        type: 'render',
        as: 'metric',
        value: {
          metric: input === null ? '?' : input,
          label,
          labelFont,
          metricFont,
          metricFormat
        }
      };
    }
  };
}