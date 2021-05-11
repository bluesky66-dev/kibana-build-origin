"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFilterTerms = void 0;

var _common = require("../../../../../common");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const createFilterTerms = (aggConfig, key, params) => {
  const field = aggConfig.params.field;
  const indexPattern = aggConfig.aggConfigs.indexPattern;

  if (key === '__other__') {
    const terms = params.terms;
    const phraseFilter = (0, _common.buildPhrasesFilter)(field, terms, indexPattern);
    phraseFilter.meta.negate = true;
    const filters = [phraseFilter];

    if (terms.some(term => term === '__missing__')) {
      filters.push((0, _common.buildExistsFilter)(field, indexPattern));
    }

    return filters;
  } else if (key === '__missing__') {
    const existsFilter = (0, _common.buildExistsFilter)(field, indexPattern);
    existsFilter.meta.negate = true;
    return existsFilter;
  }

  return (0, _common.buildPhraseFilter)(field, key, indexPattern);
};

exports.createFilterTerms = createFilterTerms;