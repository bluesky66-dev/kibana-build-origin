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
  help: _i18n.i18n.translate('xpack.canvas.functions.essqlHelpText', {
    defaultMessage: 'Queries {ELASTICSEARCH} using {ELASTICSEARCH} {SQL}.',
    values: {
      ELASTICSEARCH: _constants.ELASTICSEARCH,
      SQL: _constants.SQL
    }
  }),
  args: {
    query: _i18n.i18n.translate('xpack.canvas.functions.essql.args.queryHelpText', {
      defaultMessage: 'An {ELASTICSEARCH} {SQL} query.',
      values: {
        ELASTICSEARCH: _constants.ELASTICSEARCH,
        SQL: _constants.SQL
      }
    }),
    count: _i18n.i18n.translate('xpack.canvas.functions.essql.args.countHelpText', {
      defaultMessage: 'The number of documents to retrieve. For better performance, use a smaller data set.'
    }),
    timezone: _i18n.i18n.translate('xpack.canvas.functions.essql.args.timezoneHelpText', {
      defaultMessage: 'The timezone to use for date operations. Valid {ISO8601} formats and {UTC} offsets both work.',
      values: {
        ISO8601: _constants.ISO8601,
        UTC: _constants.UTC
      }
    })
  }
};
exports.help = help;