"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getHumanReadableComparator = getHumanReadableComparator;
exports.ComparatorFnNames = exports.ComparatorFns = void 0;
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

var Comparator;

(function (Comparator) {
  Comparator["GT"] = ">";
  Comparator["LT"] = "<";
  Comparator["GT_OR_EQ"] = ">=";
  Comparator["LT_OR_EQ"] = "<=";
  Comparator["BETWEEN"] = "between";
  Comparator["NOT_BETWEEN"] = "notBetween";
})(Comparator || (Comparator = {}));

const humanReadableComparators = new Map([[Comparator.LT, 'less than'], [Comparator.LT_OR_EQ, 'less than or equal to'], [Comparator.GT_OR_EQ, 'greater than or equal to'], [Comparator.GT, 'greater than'], [Comparator.BETWEEN, 'between'], [Comparator.NOT_BETWEEN, 'not between']]);
const ComparatorFns = getComparatorFns();
exports.ComparatorFns = ComparatorFns;
const ComparatorFnNames = new Set(ComparatorFns.keys());
exports.ComparatorFnNames = ComparatorFnNames;

function getComparatorFns() {
  const fns = {
    [Comparator.LT]: (value, threshold) => value < threshold[0],
    [Comparator.LT_OR_EQ]: (value, threshold) => value <= threshold[0],
    [Comparator.GT_OR_EQ]: (value, threshold) => value >= threshold[0],
    [Comparator.GT]: (value, threshold) => value > threshold[0],
    [Comparator.BETWEEN]: (value, threshold) => value >= threshold[0] && value <= threshold[1],
    [Comparator.NOT_BETWEEN]: (value, threshold) => value < threshold[0] || value > threshold[1]
  };
  const result = new Map();

  for (const key of Object.keys(fns)) {
    result.set(key, fns[key]);
  }

  return result;
}

function getHumanReadableComparator(comparator) {
  return humanReadableComparators.has(comparator) ? humanReadableComparators.get(comparator) : comparator;
}