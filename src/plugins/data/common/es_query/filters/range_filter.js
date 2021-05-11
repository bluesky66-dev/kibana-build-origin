"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRangeScript = exports.buildRangeFilter = exports.getRangeFilterField = exports.isScriptedRangeFilter = exports.isRangeFilter = void 0;

var _lodash = require("lodash");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const OPERANDS_IN_RANGE = 2;
const operators = {
  gt: '>',
  gte: '>=',
  lte: '<=',
  lt: '<'
};
const comparators = {
  gt: 'boolean gt(Supplier s, def v) {return s.get() > v}',
  gte: 'boolean gte(Supplier s, def v) {return s.get() >= v}',
  lte: 'boolean lte(Supplier s, def v) {return s.get() <= v}',
  lt: 'boolean lt(Supplier s, def v) {return s.get() < v}'
};
const dateComparators = {
  gt: 'boolean gt(Supplier s, def v) {return s.get().toInstant().isAfter(Instant.parse(v))}',
  gte: 'boolean gte(Supplier s, def v) {return !s.get().toInstant().isBefore(Instant.parse(v))}',
  lte: 'boolean lte(Supplier s, def v) {return !s.get().toInstant().isAfter(Instant.parse(v))}',
  lt: 'boolean lt(Supplier s, def v) {return s.get().toInstant().isBefore(Instant.parse(v))}'
};

const hasRangeKeys = params => Boolean((0, _lodash.keys)(params).find(key => ['gte', 'gt', 'lte', 'lt', 'from', 'to'].includes(key)));

const isRangeFilter = filter => filter && filter.range;

exports.isRangeFilter = isRangeFilter;

const isScriptedRangeFilter = filter => {
  const params = (0, _lodash.get)(filter, 'script.script.params', {});
  return hasRangeKeys(params);
};

exports.isScriptedRangeFilter = isScriptedRangeFilter;

const getRangeFilterField = filter => {
  return filter.range && Object.keys(filter.range)[0];
};

exports.getRangeFilterField = getRangeFilterField;

const formatValue = (field, params) => (0, _lodash.map)(params, (val, key) => (0, _lodash.get)(operators, key) + format(field, val)).join(' ');

const format = (field, value) => field && field.format && field.format.convert ? field.format.convert(value) : value; // Creates a filter where the value for the given field is in the given range
// params should be an object containing `lt`, `lte`, `gt`, and/or `gte`


const buildRangeFilter = (field, params, indexPattern, formattedValue) => {
  const filter = {
    meta: {
      index: indexPattern.id,
      params: {}
    }
  };

  if (formattedValue) {
    filter.meta.formattedValue = formattedValue;
  }

  params = (0, _lodash.mapValues)(params, value => field.type === 'number' ? parseFloat(value) : value);
  if ('gte' in params && 'gt' in params) throw new Error('gte and gt are mutually exclusive');
  if ('lte' in params && 'lt' in params) throw new Error('lte and lt are mutually exclusive');
  const totalInfinite = ['gt', 'lt'].reduce((acc, op) => {
    const key = op in params ? op : `${op}e`;
    const isInfinite = Math.abs((0, _lodash.get)(params, key)) === Infinity;

    if (isInfinite) {
      acc++; // @ts-ignore

      delete params[key];
    }

    return acc;
  }, 0);

  if (totalInfinite === OPERANDS_IN_RANGE) {
    filter.match_all = {};
    filter.meta.field = field.name;
  } else if (field.scripted) {
    filter.script = getRangeScript(field, params);
    filter.script.script.params.value = formatValue(field, filter.script.script.params);
    filter.meta.field = field.name;
  } else {
    filter.range = {};
    filter.range[field.name] = params;
  }

  return filter;
};

exports.buildRangeFilter = buildRangeFilter;

const getRangeScript = (field, params) => {
  const knownParams = (0, _lodash.pickBy)(params, (val, key) => key in operators);
  let script = (0, _lodash.map)(knownParams, (val, key) => '(' + field.script + ')' + (0, _lodash.get)(operators, key) + key).join(' && '); // We must wrap painless scripts in a lambda in case they're more than a simple expression

  if (field.lang === 'painless') {
    const comp = field.type === 'date' ? dateComparators : comparators;
    const currentComparators = (0, _lodash.reduce)(knownParams, (acc, val, key) => acc.concat((0, _lodash.get)(comp, key)), []).join(' ');
    const comparisons = (0, _lodash.map)(knownParams, (val, key) => `${key}(() -> { ${field.script} }, params.${key})`).join(' && ');
    script = `${currentComparators}${comparisons}`;
  }

  return {
    script: {
      source: script,
      params: knownParams,
      lang: field.lang
    }
  };
};

exports.getRangeScript = getRangeScript;