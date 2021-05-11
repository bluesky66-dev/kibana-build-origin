"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getIndexPatternLoadMeta = void 0;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const name = 'indexPatternLoad';
const type = 'index_pattern';

const getIndexPatternLoadMeta = () => ({
  name,
  type,
  inputTypes: ['null'],
  help: _i18n.i18n.translate('data.functions.indexPatternLoad.help', {
    defaultMessage: 'Loads an index pattern'
  }),
  args: {
    id: {
      types: ['string'],
      required: true,
      help: _i18n.i18n.translate('data.functions.indexPatternLoad.id.help', {
        defaultMessage: 'index pattern id to load'
      })
    }
  }
});

exports.getIndexPatternLoadMeta = getIndexPatternLoadMeta;