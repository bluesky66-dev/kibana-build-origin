"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CapabilitiesStrings = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("./constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const CapabilitiesStrings = {
  ReadOnlyBadge: {
    getText: () => _i18n.i18n.translate('xpack.canvas.badge.readOnly.text', {
      defaultMessage: 'Read only'
    }),
    getTooltip: () => _i18n.i18n.translate('xpack.canvas.badge.readOnly.tooltip', {
      defaultMessage: 'Unable to save {canvas} workpads',
      values: {
        canvas: _constants.CANVAS
      }
    })
  }
};
exports.CapabilitiesStrings = CapabilitiesStrings;