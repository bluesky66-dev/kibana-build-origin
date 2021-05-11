"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.render = void 0;

var _constants = require("../../../common/lib/constants");

var _constants2 = require("../../../i18n/constants");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Render: strings
} = _i18n.ViewStrings;

const render = () => ({
  name: 'render',
  displayName: strings.getDisplayName(),
  help: strings.getHelp(),
  modelArgs: [],
  requiresContext: false,
  args: [{
    name: 'containerStyle',
    argType: 'containerStyle'
  }, {
    name: 'css',
    displayName: _constants2.CSS,
    help: strings.getCssHelp(),
    argType: 'textarea',
    default: `"${_constants.DEFAULT_ELEMENT_CSS}"`,
    options: {
      confirm: strings.getCssApply()
    }
  }]
});

exports.render = render;