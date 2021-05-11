"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.math = void 0;

var _lodash = require("lodash");

var _resolved_arg = require("../../../public/lib/resolved_arg");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Math: strings
} = _i18n.ModelStrings;

const math = () => ({
  name: 'math',
  displayName: strings.getDisplayName(),
  args: [{
    name: '_',
    displayName: strings.getValueDisplayName(),
    help: strings.getValueHelp(),
    argType: 'datacolumn',
    options: {
      onlyMath: false
    }
  }],

  resolve({
    context
  }) {
    if ((0, _resolved_arg.getState)(context) !== 'ready') {
      return {
        columns: []
      };
    }

    return {
      columns: (0, _lodash.get)((0, _resolved_arg.getValue)(context), 'columns', [])
    };
  }

});

exports.math = math;