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
  help: _i18n.i18n.translate('xpack.canvas.functions.esdocsHelpText', {
    defaultMessage: 'Query {ELASTICSEARCH} for raw documents. Specify the fields you want to retrieve, ' + 'especially if you are asking for a lot of rows.',
    values: {
      ELASTICSEARCH: _constants.ELASTICSEARCH
    }
  }),
  args: {
    query: _i18n.i18n.translate('xpack.canvas.functions.esdocs.args.queryHelpText', {
      defaultMessage: 'A {LUCENE} query string.',
      values: {
        LUCENE: _constants.LUCENE
      }
    }),
    count: _i18n.i18n.translate('xpack.canvas.functions.esdocs.args.countHelpText', {
      defaultMessage: 'The number of documents to retrieve. For better performance, use a smaller data set.'
    }),
    fields: _i18n.i18n.translate('xpack.canvas.functions.esdocs.args.fieldsHelpText', {
      defaultMessage: 'A comma-separated list of fields. For better performance, use fewer fields.'
    }),
    index: _i18n.i18n.translate('xpack.canvas.functions.esdocs.args.indexHelpText', {
      defaultMessage: 'An index or index pattern. For example, {example}.',
      values: {
        example: '`"logstash-*"`'
      }
    }),
    metaFields: _i18n.i18n.translate('xpack.canvas.functions.esdocs.args.metaFieldsHelpText', {
      defaultMessage: 'Comma separated list of meta fields. For example, {example}.',
      values: {
        example: '`"_index,_type"`'
      }
    }),
    sort: _i18n.i18n.translate('xpack.canvas.functions.esdocs.args.sortHelpText', {
      defaultMessage: 'The sort direction formatted as {directions}. For example, {example1} or {example2}.',
      values: {
        directions: `\`"${['field', 'direction'].join(', ')}"\``,
        example1: `\`"${['@timestamp', 'desc'].join(', ')}"\``,
        example2: `\`"${['bytes', 'asc'].join(', ')}"\``
      }
    })
  }
};
exports.help = help;