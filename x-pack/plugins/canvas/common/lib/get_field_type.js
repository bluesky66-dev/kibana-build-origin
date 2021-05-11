"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFieldType = getFieldType;

var _unquote_string = require("./unquote_string");
/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

/**
 * Get the type for the column with the given name
 *
 * @argument columns Array of all columns
 * @field Name of the column that we are looking for the type of
 * @returns The column type or the string 'null'
 */


function getFieldType(columns, field) {
  if (!field) {
    return 'null';
  }

  const realField = (0, _unquote_string.unquoteString)(field);
  const column = columns.find(dataTableColumn => dataTableColumn.name === realField);
  return column ? column.meta.type : 'null';
}