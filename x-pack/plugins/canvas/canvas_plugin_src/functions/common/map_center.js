"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mapCenter = mapCenter;

var _functions = require("../../../i18n/functions");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function mapCenter() {
  const {
    help,
    args: argHelp
  } = (0, _functions.getFunctionHelp)().mapCenter;
  return {
    name: 'mapCenter',
    help,
    type: 'mapCenter',
    inputTypes: ['null'],
    args: {
      lat: {
        types: ['number'],
        required: true,
        help: argHelp.lat
      },
      lon: {
        types: ['number'],
        required: true,
        help: argHelp.lon
      },
      zoom: {
        types: ['number'],
        required: true,
        help: argHelp.zoom
      }
    },
    fn: (input, args) => {
      return {
        type: 'mapCenter',
        ...args
      };
    }
  };
}