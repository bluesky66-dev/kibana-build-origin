"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCell = void 0;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  GetCell: strings
} = _i18n.ViewStrings;

const getCell = () => ({
  name: 'getCell',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  modelArgs: ['size'],
  requiresContext: true,
  args: []
});

exports.getCell = getCell;