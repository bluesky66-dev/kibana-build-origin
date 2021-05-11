"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.markdown = void 0;

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Markdown: strings
} = _i18n.ViewStrings;

const markdown = () => ({
  name: 'markdown',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  modelArgs: [],
  requiresContext: false,
  args: [{
    name: '_',
    displayName: strings.getContentDisplayName(),
    help: strings.getContentHelp(),
    argType: 'textarea',
    default: '""',
    options: {
      confirm: 'Apply'
    },
    multi: true
  }, {
    name: 'font',
    argType: 'font'
  }, {
    name: 'openLinksInNewTab',
    displayName: strings.getOpenLinksInNewTabDisplayName(),
    help: strings.getOpenLinksInNewTabHelp(),
    label: strings.getOpenLinksInNewTabLabelName(),
    argType: 'toggle',
    default: false,
    options: {
      labelValue: strings.getOpenLinksInNewTabLabelName()
    }
  }]
});

exports.markdown = markdown;