"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dropdownControl = void 0;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  DropdownControl: strings
} = _i18n.ViewStrings;

const dropdownControl = () => ({
  name: 'dropdownControl',
  displayName: strings.getDisplayName(),
  modelArgs: [],
  args: [{
    name: 'valueColumn',
    displayName: strings.getValueDisplayName(),
    help: strings.getValueHelp(),
    argType: 'string',
    options: {
      confirm: 'Set'
    }
  }, {
    name: 'filterColumn',
    displayName: strings.getFilterDisplayName(),
    help: strings.getFilterHelp(),
    argType: 'string',
    options: {
      confirm: 'Set'
    }
  }, {
    name: 'filterGroup',
    displayName: strings.getFilterGroupDisplayName(),
    help: strings.getFilterGroupHelp(),
    argType: 'filterGroup'
  }]
});

exports.dropdownControl = dropdownControl;