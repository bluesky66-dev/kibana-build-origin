"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.clearHelpText', {
    defaultMessage: 'Clears the {CONTEXT}, and returns {TYPE_NULL}.',
    values: {
      CONTEXT: _constants.CONTEXT,
      TYPE_NULL: _constants.TYPE_NULL
    }
  }),
  args: {}
};
exports.help = help;