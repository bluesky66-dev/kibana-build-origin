"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBucketIdentifier = getBucketIdentifier;
exports.buildResultColumns = buildResultColumns;

var _i18n = require("@kbn/i18n");

/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

/**
 * Returns a string identifying the group of a row by a list of columns to group by
 */
function getBucketIdentifier(row, groupColumns) {
  return (groupColumns || []).map(groupColumnId => row[groupColumnId] == null ? '' : String(row[groupColumnId])).join('|');
}
/**
 * Checks whether input and output columns are defined properly
 * and builds column array of the output table if that's the case.
 *
 * * Throws an error if the output column exists already.
 * * Returns undefined if the input column doesn't exist.
 * @param input Input datatable
 * @param outputColumnId Id of the output column
 * @param inputColumnId Id of the input column
 * @param outputColumnName Optional name of the output column
 * @param options Optional options, set `allowColumnOverwrite` to true to not raise an exception if the output column exists already
 */


function buildResultColumns(input, outputColumnId, inputColumnId, outputColumnName, options = {
  allowColumnOverwrite: false
}) {
  if (!options.allowColumnOverwrite && input.columns.some(column => column.id === outputColumnId)) {
    throw new Error(_i18n.i18n.translate('expressions.functions.seriesCalculations.columnConflictMessage', {
      defaultMessage: 'Specified outputColumnId {columnId} already exists. Please pick another column id.',
      values: {
        columnId: outputColumnId
      }
    }));
  }

  const inputColumnDefinition = input.columns.find(column => column.id === inputColumnId);

  if (!inputColumnDefinition) {
    return;
  }

  const outputColumnDefinition = { ...inputColumnDefinition,
    id: outputColumnId,
    name: outputColumnName || outputColumnId
  };
  const resultColumns = [...input.columns]; // add output column after input column in the table

  resultColumns.splice(resultColumns.indexOf(inputColumnDefinition) + 1, 0, outputColumnDefinition);
  return resultColumns;
}