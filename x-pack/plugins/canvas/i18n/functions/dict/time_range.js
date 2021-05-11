"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _i18n = require("@kbn/i18n");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */


const help = {
  help: _i18n.i18n.translate('xpack.canvas.functions.timerangeHelpText', {
    defaultMessage: `An object that represents a span of time.`
  }),
  args: {
    from: _i18n.i18n.translate('xpack.canvas.functions.timerange.args.fromHelpText', {
      defaultMessage: `The start of the time range`
    }),
    to: _i18n.i18n.translate('xpack.canvas.functions.timerange.args.toHelpText', {
      defaultMessage: `The end of the time range`
    })
  }
};
exports.help = help;