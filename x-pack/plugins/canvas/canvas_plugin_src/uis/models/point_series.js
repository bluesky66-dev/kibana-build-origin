"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pointseries = void 0;

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
  PointSeries: strings
} = _i18n.ModelStrings;

const pointseries = () => ({
  name: 'pointseries',
  displayName: strings.getDisplayName(),
  args: [{
    name: 'x',
    displayName: strings.getXAxisDisplayName(),
    help: strings.getXAxisHelp(),
    argType: 'datacolumn'
  }, {
    name: 'y',
    displayName: strings.getYaxisDisplayName(),
    help: strings.getYaxisHelp(),
    argType: 'datacolumn'
  }, {
    name: 'color',
    displayName: strings.getColorDisplayName(),
    help: strings.getColorHelp(),
    argType: 'datacolumn'
  }, {
    name: 'size',
    displayName: strings.getSizeDisplayName(),
    help: strings.getSizeHelp(),
    argType: 'datacolumn'
  }, {
    name: 'text',
    displayName: strings.getTextDisplayName(),
    help: strings.getTextHelp(),
    argType: 'datacolumn'
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

exports.pointseries = pointseries;