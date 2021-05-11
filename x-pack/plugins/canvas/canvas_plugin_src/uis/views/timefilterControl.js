"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timefilterControl = void 0;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Timefilter: strings
} = _i18n.ViewStrings;

const timefilterControl = () => ({
  name: 'timefilterControl',
  displayName: strings.getDisplayName(),
  modelArgs: [],
  args: [{
    name: 'column',
    displayName: strings.getColumnDisplayName(),
    help: strings.getColumnHelp(),
    argType: 'string',
    options: {
      confirm: strings.getColumnConfirm()
    }
  }, {
    name: 'filterGroup',
    displayName: strings.getFilterGroupDisplayName(),
    help: strings.getFilterGroupHelp(),
    argType: 'filterGroup'
  }]
});

exports.timefilterControl = timefilterControl;