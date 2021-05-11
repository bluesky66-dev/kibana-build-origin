"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seriesStyle = seriesStyle;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const name = 'seriesStyle';

function seriesStyle() {
  const {
    help,
    args: argHelp
  } = (0, _i18n.getFunctionHelp)().seriesStyle;
  return {
    name,
    help,
    type: 'seriesStyle',
    inputTypes: ['null'],
    args: {
      bars: {
        types: ['number'],
        help: argHelp.bars
      },
      color: {
        types: ['string'],
        help: argHelp.color
      },
      fill: {
        types: ['number', 'boolean'],
        help: argHelp.fill,
        default: false,
        options: [true, false]
      },
      horizontalBars: {
        types: ['boolean'],
        help: argHelp.horizontalBars,
        options: [true, false]
      },
      label: {
        types: ['string'],
        help: argHelp.label
      },
      lines: {
        types: ['number'],
        help: argHelp.lines
      },
      points: {
        types: ['number'],
        help: argHelp.points
      },
      stack: {
        types: ['number', 'null'],
        help: argHelp.stack
      }
    },
    fn: (input, args) => ({
      type: name,
      ...args
    })
  };
}