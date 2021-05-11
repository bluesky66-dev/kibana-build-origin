"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDatatableColumnUtilities = void 0;

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */
const getDatatableColumnUtilities = deps => {
  const {
    getIndexPattern,
    createAggConfigs,
    aggTypesStart
  } = deps;

  const getIndexPatternFromDatatableColumn = async column => {
    if (!column.meta.index) return;
    return await getIndexPattern(column.meta.index);
  };

  const getAggConfigFromDatatableColumn = async column => {
    const indexPattern = await getIndexPatternFromDatatableColumn(column);
    if (!indexPattern) return;
    const aggConfigs = await createAggConfigs(indexPattern, [column.meta.sourceParams]);
    return aggConfigs.aggs[0];
  };

  const isFilterableAggDatatableColumn = column => {
    var _column$meta$sourcePa;

    if (column.meta.source !== 'esaggs') {
      return false;
    }

    const aggType = aggTypesStart.get((_column$meta$sourcePa = column.meta.sourceParams) === null || _column$meta$sourcePa === void 0 ? void 0 : _column$meta$sourcePa.type)({});
    return Boolean(aggType.createFilter);
  };

  return {
    getIndexPattern: getIndexPatternFromDatatableColumn,
    getAggConfig: getAggConfigFromDatatableColumn,
    isFilterable: isFilterableAggDatatableColumn
  };
};

exports.getDatatableColumnUtilities = getDatatableColumnUtilities;