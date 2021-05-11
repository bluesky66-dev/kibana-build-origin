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
  help: _i18n.i18n.translate('xpack.canvas.functions.timelionHelpText', {
    defaultMessage: 'Uses Timelion to extract one or more time series from many sources.'
  }),
  args: {
    query: _i18n.i18n.translate('xpack.canvas.functions.timelion.args.query', {
      defaultMessage: 'A Timelion query'
    }),
    interval: _i18n.i18n.translate('xpack.canvas.functions.timelion.args.interval', {
      defaultMessage: 'The bucket interval for the time series.'
    }),
    from: _i18n.i18n.translate('xpack.canvas.functions.timelion.args.from', {
      defaultMessage: 'The {ELASTICSEARCH} {DATEMATH} string for the beginning of the time range.',
      values: {
        ELASTICSEARCH: _constants.ELASTICSEARCH,
        DATEMATH: _constants.DATEMATH
      }
    }),
    to: _i18n.i18n.translate('xpack.canvas.functions.timelion.args.to', {
      defaultMessage: 'The {ELASTICSEARCH} {DATEMATH} string for the end of the time range.',
      values: {
        ELASTICSEARCH: _constants.ELASTICSEARCH,
        DATEMATH: _constants.DATEMATH
      }
    }),
    timezone: _i18n.i18n.translate('xpack.canvas.functions.timelion.args.timezone', {
      defaultMessage: 'The timezone for the time range. See {MOMENTJS_TIMEZONE_URL}.',
      values: {
        MOMENTJS_TIMEZONE_URL: _constants.MOMENTJS_TIMEZONE_URL
      }
    })
  }
};
exports.help = help;