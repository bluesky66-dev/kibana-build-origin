"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shape = void 0;

var _shapes = require("../../renderers/shape/shapes");

var _i18n = require("../../../i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const {
  Shape: strings
} = _i18n.ViewStrings;

const shape = () => ({
  name: 'shape',
  displayName: strings.getDisplayName(),
  modelArgs: [],
  requiresContext: false,
  args: [{
    name: '_',
    displayName: strings.getShapeDisplayName(),
    argType: 'shape',
    options: {
      shapes: _shapes.shapes
    }
  }, {
    name: 'fill',
    displayName: strings.getFillDisplayName(),
    argType: 'color',
    help: strings.getFillHelp()
  }, {
    name: 'border',
    displayName: strings.getBorderDisplayName(),
    argType: 'color',
    help: strings.getBorderHelp()
  }, {
    name: 'borderWidth',
    displayName: strings.getBorderWidthDisplayName(),
    argType: 'number',
    help: strings.getBorderWidthHelp()
  }, {
    name: 'maintainAspect',
    displayName: strings.getMaintainAspectDisplayName(),
    argType: 'toggle',
    help: strings.getMaintainAspectHelp(),
    options: {
      labelValue: strings.getMaintainAspectLabelName()
    }
  }]
});

exports.shape = shape;