"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clear = clear;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


function clear() {
  const {
    help
  } = (0, _i18n.getFunctionHelp)().clear;
  return {
    name: 'clear',
    type: 'null',
    inputTypes: ['null'],
    help,
    args: {},
    fn: () => null
  };
}