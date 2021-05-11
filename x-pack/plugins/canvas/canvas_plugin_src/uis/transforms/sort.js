"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sort = void 0;

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
  Sort: strings
} = _i18n.TransformStrings;

const sort = () => ({
  name: 'sort',
  displayName: strings.getDisplayName(),
  args: [{
    name: '_',
    displayName: strings.getSortFieldDisplayName(),
    argType: 'datacolumn'
  }, {
    name: 'reverse',
    displayName: strings.getReverseDisplayName(),
    argType: 'toggle'
  }],

  resolve({
    context
  }) {
    if ((0, _resolved_arg.getState)(context) === 'ready') {
      return {
        columns: (0, _lodash.get)((0, _resolved_arg.getValue)(context), 'columns', [])
      };
    }

    return {
      columns: []
    };
  }

});

exports.sort = sort;