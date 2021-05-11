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
  help: _i18n.i18n.translate('xpack.canvas.functions.escountHelpText', {
    defaultMessage: 'Query {ELASTICSEARCH} for the number of hits matching the specified query.',
    values: {
      ELASTICSEARCH: _constants.ELASTICSEARCH
    }
  }),
  args: {
    query: _i18n.i18n.translate('xpack.canvas.functions.escount.args.queryHelpText', {
      defaultMessage: 'A {LUCENE} query string.',
      values: {
        LUCENE: _constants.LUCENE
      }
    }),
    index: _i18n.i18n.translate('xpack.canvas.functions.escount.args.indexHelpText', {
      defaultMessage: 'An index or index pattern. For example, {example}.',
      values: {
        example: '`"logstash-*"`'
      }
    })
  }
};
exports.help = help;