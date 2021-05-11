"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errors = exports.help = void 0;

var _i18n = require("@kbn/i18n");

var _constants = require("../../constants");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.toHelpText', {
    defaultMessage: 'Explicitly casts the type of the {CONTEXT} from one type to the specified type.',
    values: {
      CONTEXT: _constants.CONTEXT
    }
  }),
  args: {
    type: _i18n.i18n.translate('xpack.canvas.functions.to.args.type', {
      defaultMessage: 'A known data type in the expression language.'
    })
  }
};
exports.help = help;
const errors = {
  missingType: () => new Error(_i18n.i18n.translate('xpack.canvas.functions.to.missingType', {
    defaultMessage: 'Must specify a casting type'
  }))
};
exports.errors = errors;