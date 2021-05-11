"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildInlineScriptForPhraseFilter = exports.getConvertedValueForField = exports.getPhraseScript = exports.buildPhraseFilter = exports.getPhraseFilterValue = exports.getPhraseFilterField = exports.isScriptedPhraseFilter = exports.isPhraseFilter = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const isPhraseFilter = filter => {
  const isMatchPhraseQuery = filter && filter.query && filter.query.match_phrase;
  const isDeprecatedMatchPhraseQuery = filter && filter.query && filter.query.match && Object.values(filter.query.match).find(params => params.type === 'phrase');
  return Boolean(isMatchPhraseQuery || isDeprecatedMatchPhraseQuery);
};

exports.isPhraseFilter = isPhraseFilter;

const isScriptedPhraseFilter = filter => Boolean((0, _lodash.get)(filter, 'script.script.params.value'));

exports.isScriptedPhraseFilter = isScriptedPhraseFilter;

const getPhraseFilterField = filter => {
  const queryConfig = filter.query.match_phrase || filter.query.match;
  return Object.keys(queryConfig)[0];
};

exports.getPhraseFilterField = getPhraseFilterField;

const getPhraseFilterValue = filter => {
  const queryConfig = filter.query.match_phrase || filter.query.match;
  const queryValue = Object.values(queryConfig)[0];
  return (0, _lodash.isPlainObject)(queryValue) ? queryValue.query : queryValue;
};

exports.getPhraseFilterValue = getPhraseFilterValue;

const buildPhraseFilter = (field, value, indexPattern) => {
  const convertedValue = getConvertedValueForField(field, value);

  if (field.scripted) {
    return {
      meta: {
        index: indexPattern.id,
        field: field.name
      },
      script: getPhraseScript(field, value)
    };
  } else {
    return {
      meta: {
        index: indexPattern.id
      },
      query: {
        match_phrase: {
          [field.name]: convertedValue
        }
      }
    };
  }
};

exports.buildPhraseFilter = buildPhraseFilter;

const getPhraseScript = (field, value) => {
  const convertedValue = getConvertedValueForField(field, value);
  const script = buildInlineScriptForPhraseFilter(field);
  return {
    script: {
      source: script,
      lang: field.lang,
      params: {
        value: convertedValue
      }
    }
  };
};
/**
 * @internal
 * See issues bellow for the reason behind this change.
 * Values need to be converted to correct types for boolean \ numeric fields.
 * https://github.com/elastic/kibana/issues/74301
 * https://github.com/elastic/kibana/issues/8677
 * https://github.com/elastic/elasticsearch/issues/20941
 * https://github.com/elastic/elasticsearch/pull/22201
 **/


exports.getPhraseScript = getPhraseScript;

const getConvertedValueForField = (field, value) => {
  if (typeof value !== 'boolean' && field.type === 'boolean') {
    if ([1, 'true'].includes(value)) {
      return true;
    } else if ([0, 'false'].includes(value)) {
      return false;
    } else {
      throw new Error(`${value} is not a valid boolean value for boolean field ${field.name}`);
    }
  }

  if (typeof value !== 'number' && field.type === 'number') {
    return Number(value);
  }

  return value;
};
/**
 * @internal
 * Takes a scripted field and returns an inline script appropriate for use in a script query.
 * Handles lucene expression and Painless scripts. Other langs aren't guaranteed to generate valid
 * scripts.
 *
 * @param {object} scriptedField A Field object representing a scripted field
 * @returns {string} The inline script string
 */


exports.getConvertedValueForField = getConvertedValueForField;

const buildInlineScriptForPhraseFilter = scriptedField => {
  // We must wrap painless scripts in a lambda in case they're more than a simple expression
  if (scriptedField.lang === 'painless') {
    return `boolean compare(Supplier s, def v) {return s.get() == v;}` + `compare(() -> { ${scriptedField.script} }, params.value);`;
  } else {
    return `(${scriptedField.script}) == value`;
  }
};

exports.buildInlineScriptForPhraseFilter = buildInlineScriptForPhraseFilter;