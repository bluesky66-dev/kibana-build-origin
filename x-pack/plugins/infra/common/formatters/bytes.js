"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createBytesFormatter = void 0;

var _number = require("./number");

var _types = require("./types");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * The labels are derived from these two Wikipedia articles.
 * https://en.wikipedia.org/wiki/Kilobit
 * https://en.wikipedia.org/wiki/Kilobyte
 */


const LABELS = {
  [_types.InfraWaffleMapDataFormat.bytesDecimal]: ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
  [_types.InfraWaffleMapDataFormat.bitsDecimal]: ['bit', 'kbit', 'Mbit', 'Gbit', 'Tbit', 'Pbit', 'Ebit', 'Zbit', 'Ybit'],
  [_types.InfraWaffleMapDataFormat.abbreviatedNumber]: ['', 'K', 'M', 'B', 'T']
};
const BASES = {
  [_types.InfraWaffleMapDataFormat.bytesDecimal]: 1000,
  [_types.InfraWaffleMapDataFormat.bitsDecimal]: 1000,
  [_types.InfraWaffleMapDataFormat.abbreviatedNumber]: 1000
};
/*
 * This formatter always assumes you're input is bytes and the output is a string
 * in whatever format you've defined. Bytes in Format Out.
 */

const createBytesFormatter = format => bytes => {
  const labels = LABELS[format];
  const base = BASES[format];
  const value = format === _types.InfraWaffleMapDataFormat.bitsDecimal ? bytes * 8 : bytes; // Use an exponetial equation to get the power to determine which label to use. If the power
  // is greater then the max label then use the max label.

  const power = Math.min(Math.floor(Math.log(Math.abs(value)) / Math.log(base)), labels.length - 1);

  if (power < 0) {
    return `${(0, _number.formatNumber)(value)}${labels[0]}`;
  }

  return `${(0, _number.formatNumber)(value / Math.pow(base, power))}${labels[power]}`;
};

exports.createBytesFormatter = createBytesFormatter;